<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends BaseController
{
    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            if (blank($data['institution_id'] ?? null) && filled($data['institution'] ?? null)) {
                $institution = Institution::create(['name' => $data['institution']]);
                $data['institution_id'] = $institution->id;
            }

            User::create($data);
            DB::commit();
            return $this->sendResponse([], 'Berhasil mendaftar');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Terjadi kesalahan dalam pendaftaran', [$e->getMessage()], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (Auth::attempt($credentials)) {
            $user = User::with('studyProgram')->find(Auth::id());
            $success['token'] =  $user->createToken('api_token')->plainTextToken;
            $success['user'] =  $user;

            return $this->sendResponse($success, 'Berhasil login');
        }

        return $this->sendError('Unauthorized', ['error' => 'Unauthorized'], 401);
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $status = Password::sendResetLink($request->validated());

        if ($status === Password::RESET_LINK_SENT) {
            return $this->sendResponse([], 'Tautan reset password telah dikirim ke email Anda.');
        }

        if ($status === Password::RESET_THROTTLED) {
            return $this->sendError('Terlalu banyak permintaan', [
                'email' => ['Anda baru saja meminta reset password. Silakan tunggu beberapa saat lagi.'],
            ], 429);
        }

        return $this->sendError('Email tidak terdaftar', [
            'email' => ['Email tidak terdaftar pada sistem!'],
        ], 422);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $data = $request->validated();

        $status = Password::reset(
            [
                'email' => $data['email'],
                'password' => $data['password'],
                'token' => $data['token'],
            ],
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->sendResponse([], 'Password berhasil diubah. Silakan login kembali.');
        }

        return $this->sendError('Tautan reset password tidak valid', [
            'token' => ['Tautan reset password tidak valid atau sudah kedaluwarsa. Silakan ajukan permintaan baru.'],
        ], 422);
    }

    public function getCurrentUser()
    {
        $user = User::with(['studyProgram', 'institution'])->find(auth('sanctum')->id());
        if (!$user) {
            return $this->sendError('Unauthorized', ['error' => 'Unauthorized'], 401);
        }
        return $this->sendResponse($user, "User Retreive Successfully");
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return $this->sendResponse([], 'Berhasil logout');
    }
}
