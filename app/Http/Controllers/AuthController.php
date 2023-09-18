<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = DB::transaction(function () use ($request) {
            $customer = Customer::create($request->all());
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'customer_id' => $customer->id
            ]);
            return $user;
        });

        return response()->json([
            'header' => 'rejestracja udana',
            'message' => "Udana rejestracja użytkownika $user->name"
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            return response()->json(collect(new UserResource($request->user()))
                ->merge(['roles' => $request->user()->getRoleNames()]));
        }

        return response()->json([
            'message' => 'Logowanie nieudane',
            'errors' => ['login' => 'Email lub hasło są niepoprawne']
        ], 401);
    }

    public function logout(Request $request): JsonResponse
    {
        if (Auth::user()) {
            Auth::logout();
            $request->session()->invalidate();
            return response()->json([
                'header' => 'wylogowano pomyślnie',
            ]);
        }

        return response()->json([
            'header' => 'Nie udało się znaleźć użytkownika',
        ], 401);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json(collect(new UserResource($request->user()))
            ->merge(['roles' => $request->user()->getRoleNames()]));
    }

    public function searchEmail(Request $request): Response
    {
        $user = User::where('email', $request->val)->get();
        if ($user->isEmpty()) {
            return response(false);
        }
        return response(true);
    }
}
