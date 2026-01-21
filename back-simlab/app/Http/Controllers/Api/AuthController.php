<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

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
