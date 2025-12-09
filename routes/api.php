<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\CallController;
use App\Http\Controllers\IceServersController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest:sanctum')->group(function () {
    Route::post('/register', [RegisterController::class, 'register']);
    Route::post('/login', [LoginController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'getUser']);

    Route::post('/logout', [LoginController::class, 'logout']);

    Route::get('/ice-servers', [IceServersController::class, 'index']);

    Route::post('/call/initiate', [CallController::class, 'initiate']);
    Route::post('/call/answer', [CallController::class, 'answer']);
    Route::post('/call/end', [CallController::class, 'end']);
    Route::post('/call/webrtc/signal', [CallController::class, 'signal']);
});
