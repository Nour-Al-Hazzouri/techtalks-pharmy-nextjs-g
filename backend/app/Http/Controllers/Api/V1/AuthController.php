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
        $token = $this->authService->login($request->validated());
        if (!$token) {
            return $this->errorResponse('Unauthorized', [], 401);
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
         // Needs validation but simplified for now to keep it in one file or reuse request
         $user = auth()->user();
         $user->update($request->only(['name', 'phone']));
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

