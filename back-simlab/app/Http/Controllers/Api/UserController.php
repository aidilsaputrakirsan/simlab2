<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AsignRoleRequest;
use App\Http\Requests\UserRequest;
use App\Models\StudyProgram;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = User::query()->with(['studyProgram', 'institution']);

            if ($request->filter_study_program) {
                $query->where('study_program_id', $request->filter_study_program);
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

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $users = $query->paginate($perPage, ['*'], 'page', $page);
            return $this->sendResponse($users, 'Data pengguna berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data pengguna', [$e->getMessage()], 500);
        }
    }

    public function store(UserRequest $request)
    {
        try {
            if ($request->role !== 'laboran' && $request->role !== 'admin_pengujian') {
                $studyProgram = StudyProgram::find($request->study_program_id);

                // Validate role for new user
                $validationError = $this->validateRoleAssignment(
                    role: $request->role,
                    studyProgramId: $studyProgram->id,
                    majorId: $studyProgram->major_id
                );
                if ($validationError) {
                    return $this->sendError($validationError['message'], [], $validationError['code'] ?? 422);
                }
            }

            $user = User::create($request->validated());

            return $this->sendResponse($user, 'Berhasil menambah data pengguna', 201);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menambah data pengguna', [$e->getMessage()], 500);
        }
    }

    public function update(UserRequest $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $data = $request->validated();

            if (!$request->password) {
                unset($data['password']);
            }

            $validationError = $this->validateRoleAssignment(
                role: $user->role,
                studyProgramId: $user->study_program_id,
                majorId: $user->studyProgram?->major_id,
                excludeUserId: $user->id
            );
            if ($validationError) {
                return $this->sendError($validationError['message'], [], 422);
            }

            $user->update($data);

            return $this->sendResponse($user, "Behasil mengubah data pengguna");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Pengguna tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengubah data pengguna', [$e->getMessage()], 500);
        }
    }

    public function restoreToDosen($id)
    {
        try {
            $user = User::findOrFail($id);

            $user->update(['role' => 'dosen']);

            return $this->sendResponse($user, "Berhasil memulihkan role pengguna ke Dosen");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Pengguna tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengubah data pengguna', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return $this->sendResponse([], 'Berhasil menghapus data pengguna');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Pengguna tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus data pengguna', [$e->getMessage()], 500);
        }
    }

    public function toggleManager($id)
    {
        try {
            $user = User::findOrFail($id);
            if ($user->role !== 'laboran') {
                return $this->sendError('Hanya laboran yang dapat melakukan aksi ini', [], 422);
            }

            $user->update(['is_manager' => !$user->is_manager]);

            return $this->sendResponse($user, 'Berhasil mengubah data laboran');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboran tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus data laboran', [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect(Request $request)
    {
        try {
            $query = User::query()->select('id', 'name');
            $query->where('role', $request->role);
            $users = $query->get();
            return $this->sendResponse($users, 'Data pengguna berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError("Gagal mengambil data pengguna", [$e->getMessage()], 500);
        }
    }

    private function validateRoleAssignment($role, $studyProgramId, $majorId, $excludeUserId = null)
    {
        $query = User::where('role', $role);

        if ($excludeUserId) {
            $query->where('id', '!=', $excludeUserId);
        }

        switch ($role) {
            case 'kepala_lab_terpadu':
                if ($query->exists()) {
                    return ['message' => 'Sudah ada user dengan role Kepala Laboratorium Terpadu.', 'code' => 422];
                }
                break;

            case 'kepala_lab_jurusan':
                $query->whereHas(
                    'studyProgram',
                    fn($q) =>
                    $q->where('major_id', $majorId)
                );

                if ($query->exists()) {
                    return ['message' => 'Sudah ada user dengan jurusan yang sama di role Kepala Lab Jurusan.', 'code' => 422];
                }
                break;

            case 'koorprodi':
                $query->where('study_program_id', $studyProgramId);

                if ($query->exists()) {
                    return ['message' => 'Sudah ada user dengan prodi ini di role Koorprodi.', 'code' => 422];
                }
                break;
        }

        return null;
    }
}
