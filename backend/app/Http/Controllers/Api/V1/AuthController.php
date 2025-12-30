<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Traits\ApiResponse;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    use ApiResponse;

    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        $user = $this->authService->register($request->validated());
          $token = auth('api')->login($user);
        return $this->successResponse('User registered successfully', new UserResource($user), 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $token = $this->authService->login($credentials);
        if (!$token) {
            $user = \App\Models\User::where('email', $credentials['email'])->first();
            if (!$user) {
                return $this->errorResponse('No account found with this email address.', [], 401);
            }

            if (!Hash::check($credentials['password'], $user->password)) {
                return $this->errorResponse('Incorrect password. Please try again.', [], 401);
            }

            return $this->errorResponse('Unable to log in. Please try again later.', [], 401);
        }

        $user = auth('api')->user();

        // If auth('api')->user() is still null (sometimes happens depending on JWT setup/middleware state in the same request), explicitly get via email
        if (!$user) {
            $user = \App\Models\User::where('email', $request->email)->first();
        }

        return $this->successResponse('Login successful', [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => new UserResource($user)
        ]);
    }

    public function logout()
    {
        $this->authService->logout();
        return $this->successResponse('Successfully logged out');
    }

    public function refresh()
    {
        $token = $this->authService->refresh();
         return $this->successResponse('Token refreshed', [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }

    public function profile()
    {
        return $this->successResponse('User profile', new UserResource($this->authService->userProfile()));
    }

    public function updateProfile(Request $request)
    {
         $user = auth()->user();

         $normalizeLebanonPhone = function (?string $value): ?string {
             if ($value === null) return null;
             $raw = trim($value);
             if ($raw === '') return null;
             $digits = preg_replace('/\D+/', '', $raw);
             if (!$digits) return null;

             $national = $digits;
             if (str_starts_with($national, '961')) {
                 $national = substr($national, 3);
             }
             if (str_starts_with($national, '0')) {
                 $national = substr($national, 1);
             }

             return $national;
         };

         $validated = $request->validate([
             'name' => ['sometimes', 'string', 'max:255', 'regex:/^\p{L}[\p{L}\p{M}]*(?:[ \-\'\x{2019}]\p{L}[\p{L}\p{M}]*)*$/u'],
             'email' => [
                 'sometimes',
                 'email',
                 'regex:/^[^\s@]+@[^\s@]+\.[^\s@]{1,}$/',
                 'max:255',
                 Rule::unique('users', 'email')->ignore($user->id),
             ],
             'phone' => [
                 'sometimes',
                 'nullable',
                 'string',
                 'max:50',
                 'regex:/^(?:\+961 ?\d{2} ?\d{3} ?\d{3}|\+961\d{8}|00961 ?\d{2} ?\d{3} ?\d{3}|00961\d{8}|\d{2} ?\d{3} ?\d{3}|\d{8})$/',
             ],
         ]);

         $user->update($validated);

         return $this->successResponse('Profile updated', new UserResource($user));
    }

    public function updatePassword(Request $request)

    {
        $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed'
        ]);

        $user = auth()->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Old password is incorrect'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    }

    }

