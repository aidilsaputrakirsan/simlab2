<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\InstitutionRequest;
use App\Http\Resources\InstitutionResource;
use App\Models\Institution;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class InstitutionController extends BaseController
{
    public function index(Request $request) {
        try {
            // Start with a base query
            $query = Institution::query();
            $query->with('users');

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('name', 'LIKE', "%{$searchTerm}%");
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $institutions = $query->paginate($perPage, ['*'], 'page', $page);
            $response = [
                'current_page' => $institutions->currentPage(),
                'last_page' => $institutions->lastPage(),
                'per_page' => $institutions->perPage(),
                'total' => $institutions->total(),
                'data' => InstitutionResource::collection($institutions)
            ];

            return $this->sendResponse($response, 'Berhasil mengambil data institusi');
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengambil data institusi', [$e->getMessage()], 500);
        }
    }

    public function store(InstitutionRequest $request)
    {
        try {
            $institution = Institution::create($request->validated());
            return $this->sendResponse([], 'Berhasil menambah institusi', 201);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menambah institusi', [$e->getMessage()], 500);
        }
    }

    public function update(InstitutionRequest $request, $id)
    {
        try {
            $institution = Institution::findOrFail($id);
            $institution->update($request->validated());

            return $this->sendResponse([], "Berhasil mengubah institusi");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Institusi tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengubah institusi', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $institution = Institution::findOrFail($id);
            $institution->delete();

            return $this->sendResponse([], 'Berhasil menghapus institusi');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Institusi tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus institusi', [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect()
    {
        try {
            $institutions = Institution::all();
            return $this->sendResponse(InstitutionResource::collection($institutions), 'Data pengguna berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError("Gagal mengambil data institusi", [$e->getMessage()], 500);
        }
    }
}
