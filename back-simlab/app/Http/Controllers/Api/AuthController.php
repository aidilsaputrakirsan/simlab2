<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends BaseController
{
    public function register(Request $request)
    {
        $rules = [
            'name' => 'required|max:191',
            'email' => 'required|email|max:191|unique:users,email',
            'identity_num' => 'required|max:100',
            'role' => 'required',
            'password' => 'required|min:8',
            'c_password' => 'required|same:password',
        ];

        $messages = [
            'name.required' => 'Nama tidak boleh kosong!',
            'name.max' => 'Nama maksimal 191 karakter!',

            'email.required' => 'Email tidak boleh kosong!',
            'email.email' => 'Format email tidak valid!',
            'email.max' => 'Email maksimal 191 karakter!',
            'email.unique' => 'Email sudah terdaftar!',

            'identity_num.required' => 'NIM / NIP / NIPH / Identitas lainnya tidak boleh kosong!',
            'identity_num.max' => 'Identitas maksimal 100 karakter!',

            'role.required' => 'Silakan pilih peran terlebih dahulu!',

            'password.required' => 'Password tidak boleh kosong!',
            'password.min' => 'Password minimal 8 karakter!',

            'c_password.required' => 'Konfirmasi password tidak boleh kosong!',
            'c_password.same' => 'Konfirmasi password tidak cocok dengan password!',
        ];

        if ($request->role != 'Pihak Luar') {
            $rules['prodi_id'] = 'required';
            $messages['prodi_id.required'] = 'Program Studi harus diisi jika bukan pihak eksternal!';
        }

        $validator = Validator::make(
            $request->all(),
            $rules,
            $messages
        );

        if ($validator->fails()) {
            return $this->sendError('Invalid input', $validator->errors(), 400);
        }

        $user = User::create($request->all());
        // $success['token'] = $user->createToken('api_token')->plainTextToken;
        // $success['name'] = $user->name;

        return $this->sendResponse([], 'Berhasil mendaftar');
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:191',
            'password' => 'required|max:191',
        ], [
            'email.required' => 'Email tidak boleh kosong!',
            'email.email' => 'Format email tidak valid!',
            'email.max' => 'Email maksimal 191 karakter!',
            'password.required' => 'Password tidak boleh kosong!',
            'password.max' => 'Password maksimal 191 karakter!',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Invalid input', $validator->errors(), 400);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $success['token'] =  $user->createToken('api_token')->plainTextToken;
            $success['user'] =  $user;

            return $this->sendResponse($success, 'Berhasil login');
        }

        return $this->sendError('Unauthorized', ['error'=>'Unauthorized']);
    }

    public function getCurrentUser()
    {
        return $this->sendResponse(auth('sanctum')->user(), "User Retreive Successfully");
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return $this->sendResponse([], 'Berhasil logout');
    }
}
