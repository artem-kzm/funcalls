<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'nickname' => $request->nickname(),
            'password' => Hash::make($request->password()),
        ]);

        Auth::guard('web')->login($user);

        $request->session()->regenerate();

        return response()->json([
            'user' => new UserResource($user),
            'message' => 'Registered successfully'
        ], 201);
    }
}
