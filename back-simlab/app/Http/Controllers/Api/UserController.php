<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends BaseController
{
    public function validateUser($request, $id = null)
    {
        $rules = [
            'email' => "required|unique:users,email,{$id},id|max:191",
            'name' => 'required|max:191',
            'password' => ($id == 'undefined' ? 'required' : 'nullable') . '|min:8',
            'role' => 'required',
        ];
        $messages = [
            'email.required' => 'Email tidak boleh kosong!',
            'email.unique' => 'Email tidak boleh sama dengan yang sudah ada!',
            'email.max' => 'Email maximal 191 digit karakter!',
            'name.required' => 'Nama Akun User tidak boleh kosong!',
            'nama.max' => 'Nama Akun User maximal 191 digit karakter!',
            'password.required' => 'Password tidak boleh kosong!',
            'password.min' => 'Password minimal 8 digit karakter!',
        ];

        if ($request->role == 'dosen') {
            $rules['prodi_id'] = 'required';
            $messages['prodi_id.required'] = 'Prodi tidak boleh kosong!';
        }

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return $this->sendError('Invalid input', $validator->errors(), 400);
        }
    }

    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = User::query()->with('studyProgram');

            if ($request->filter_prodi) {
                $query->where('prodi_id', $request->filter_prodi);
            }

            // Add search functionality
            if ($request->search) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('identity_num', 'LIKE', "%{$searchTerm}%");
                });
            }

            // get user seected role
            $query->where('role', $request->role);

            // Add sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'name', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $users = $query->paginate($perPage, ['*'], 'page', $page);
            return $this->sendResponse($users, 'User Retrieved Successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve User', [$e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $rules = [
                'email' => "required|unique:users,email|max:191",
                'name' => 'required|max:191',
                'password' => 'required|min:8',
                'role' => 'required',
            ];
            $messages = [
                'email.required' => 'Email tidak boleh kosong!',
                'email.unique' => 'Email tidak boleh sama dengan yang sudah ada!',
                'email.max' => 'Email maximal 191 digit karakter!',
                'name.required' => 'Nama Akun User tidak boleh kosong!',
                'nama.max' => 'Nama Akun User maximal 191 digit karakter!',
                'password.required' => 'Password tidak boleh kosong!',
                'password.min' => 'Password minimal 8 digit karakter!',
            ];

            if ($request->role == 'Dosen') {
                $rules['prodi_id'] = 'required';
                $messages['prodi_id.required'] = 'Prodi tidak boleh kosong!';
            }

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            if ($this->checkIsSingleRoleExist($request->role, $request->prodi_id)) {
                return $this->sendError('Sudah ada user dengan prodi ini di role tersebut.', [], 400);
            }

            $user = User::create($request->all());

            return $this->sendResponse($user, 'User Created Successfully', 201);
        } catch (\Exception $e) {
            return $this->sendError('Failed to create User', [$e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'email' => "required|unique:users,email,{$id},id|max:191",
                'name' => 'required|max:191',
                'password' => ($id == 'undefined' ? 'required' : 'nullable') . '|min:8',
                'role' => 'required',
            ];
            $messages = [
                'email.required' => 'Email tidak boleh kosong!',
                'email.unique' => 'Email tidak boleh sama dengan yang sudah ada!',
                'email.max' => 'Email maximal 191 digit karakter!',
                'name.required' => 'Nama Akun User tidak boleh kosong!',
                'nama.max' => 'Nama Akun User maximal 191 digit karakter!',
                'password.required' => 'Password tidak boleh kosong!',
                'password.min' => 'Password minimal 8 digit karakter!',
            ];

            if ($request->role == 'Dosen') {
                $rules['prodi_id'] = 'required';
                $messages['prodi_id.required'] = 'Prodi tidak boleh kosong!';
            }

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            $user = User::findOrFail($id);

            $data = $request->all();

            if (!$request->password) {
                unset($data['password']);
            }

            if ($this->checkIsSingleRoleExist($request->role, $request->prodi_id, $user)) {
                return $this->sendError('Sudah ada user dengan prodi ini di role tersebut.', [], 422);
            }

            $user->update($data);

            return $this->sendResponse($user, "User Updated Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("User Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update User', [$e->getMessage()], 500);
        }
    }

    // for checking person have koorprodi & kepala lab is exists
    private function checkIsSingleRoleExist($role, $prodi_id, $selected_user = null)
    {
        if ($role == 'Koorprodi' || $role == 'Kepala Lab Unit') {
            $user = User::where('role', $role)->where('prodi_id', $prodi_id)->first();
            if ($selected_user && $user) {
                return $user->id != $selected_user->id ? true : false;
            }
            return $user ? true : false;
        }

        return false;
    }

    public function restoreToDosen($id)
    {
        try {
            $user = User::findOrFail($id);

            $user->update(['role' => 'Dosen']);

            return $this->sendResponse($user, "User Updated Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("User Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update User', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return $this->sendResponse([], 'User Deleted Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("User Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete User', [$e->getMessage()], 500);
        }
    }
}
