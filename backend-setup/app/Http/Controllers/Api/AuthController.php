<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:50',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
        ]);

        $token = auth('api')->login($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ], 201);
    }

    public function registerPhone(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50|unique:users,phone',
            'password' => 'required|string|min:4',
        ]);

        $phone = $this->normalizePhone($validated['phone']);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $phone.'@golib.local',
            'phone' => $phone,
            'password' => Hash::make($validated['password']),
        ]);

        $token = auth('api')->login($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
            ],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        if ($request->filled('phone') && ! $request->filled('email')) {
            return $this->loginPhone($request);
        }

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (! $token = auth('api')->attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ]);
    }

    public function loginPhone(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $phone = $this->normalizePhone($validated['phone']);
        $user = User::where('phone', $phone)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'phone' => ['Неверный номер или пароль'],
            ]);
        }

        $token = auth('api')->login($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
            ],
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email|exists:users']);

        return response()->json(['message' => 'Password reset link sent.']);
    }

    private function normalizePhone(string $input): string
    {
        $digits = preg_replace('/\D/', '', $input) ?? '';
        if (str_starts_with($digits, '992')) {
            return '+'.$digits;
        }
        if (strlen($digits) === 9) {
            return '+992'.$digits;
        }

        return $digits ? '+'.$digits : $input;
    }
}
