<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\TestingCategoryRequest;
use App\Models\TestingCategory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class TestingCategoryController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = TestingCategory::query();

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $testing_categories = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($testing_categories, 'Data kategori pengujian berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data kategori pengujian', [$e->getMessage()], 500);
        }
    }

    public function store(TestingCategoryRequest $request)
    {
        try {
            $testing_category = TestingCategory::create($request->validated());

            return $this->sendResponse($testing_category, 'Berhasil menambah data kategori pengujian');
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam menambah data kategori pengujian', [$e->getMessage()], 500);
        }
    }

    public function update(TestingCategoryRequest $request, $id)
    {
        try {
            $testing_category = TestingCategory::findOrFail($id);
            $testing_category->update($request->validated());

            return $this->sendResponse($testing_category, "Berhasil mengubah data kategori pengujian");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Kategori pengujian tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengubah data kategori pengujian', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $testing_category = TestingCategory::findOrFail($id);
            $testing_category->delete();

            return $this->sendResponse([], 'Berhasil menghapus data kategori pengujian');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Kategori pengujian tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengubah data kategori pengujian', [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect()
    {
        try {
            $testing_categories = TestingCategory::select('id', 'name')->get();

            return $this->sendResponse($testing_categories, 'Data kategori pengujian berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data kategori pengujian', [$e->getMessage()], 500);
        }
    }
}
