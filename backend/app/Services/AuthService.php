<?php

namespace App\Services;

use App\Repositories\AuthRepository;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    protected $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function register(array $data)
    {
        return $this->authRepository->create($data);
    }

    public function login(array $credentials)
    {
        return $this->authRepository->login($credentials);
    }

    public function logout()
    {
        $this->authRepository->logout();
    }

    public function refresh()
    {
        return $this->authRepository->refresh();
    }
    
    public function userProfile()
    {
        return Auth::user();
    }
}
