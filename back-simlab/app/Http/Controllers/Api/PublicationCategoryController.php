<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\PublicationCategoryRequest;
use App\Models\PublicationCategory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class PublicationCategoryController extends BaseController
{
	public function index(Request $request)
	{
		try {
			$query = PublicationCategory::query();

			if ($request->has('search')) {
				$searchTerm = $request->input('search');
				$query->where('name', 'LIKE', "%{$searchTerm}%");
			}

			$perPage = $request->input('per_page', 10);
			$page = $request->input('page', 1);

			$publication_categories = $query->paginate($perPage, ['*'], 'page', $page);

			return $this->sendResponse($publication_categories, 'Data kategori publikasi berhasil diambil');
		} catch (\Exception $e) {
			return $this->sendError('Gagal mengambil data kategori publikasi', [$e->getMessage()], 500);
		}
	}

	public function store(PublicationCategoryRequest $request)
	{
		try {
			$publication_category = PublicationCategory::create($request->validated());

			return $this->sendResponse($publication_category, 'Berhasil menambah data kategori publikasi');
		} catch (\Exception $e) {
			return $this->sendError('Terjadi kesalahan dalam menambah data kategori publikasi', [$e->getMessage()], 500);
		}
	}

	public function update(PublicationCategoryRequest $request, $id)
	{
		try {
			$publication_category = PublicationCategory::findOrFail($id);
			$publication_category->update($request->validated());

			return $this->sendResponse($publication_category, 'Berhasil mengubah data kategori publikasi');
		} catch (ModelNotFoundException $e) {
			return $this->sendError('Kategori publikasi tidak ditemukan', [], 404);
		} catch (\Exception $e) {
			return $this->sendError('Terjadi kesalahan dalam mengubah data kategori publikasi', [$e->getMessage()], 500);
		}
	}

	public function destroy($id)
	{
		try {
			$publication_category = PublicationCategory::findOrFail($id);
			$publication_category->delete();

			return $this->sendResponse([], 'Berhasil menghapus data kategori publikasi');
		} catch (ModelNotFoundException $e) {
			return $this->sendError('Kategori publikasi tidak ditemukan', [], 404);
		} catch (\Exception $e) {
			return $this->sendError('Terjadi kesalahan dalam menghapus data kategori publikasi', [$e->getMessage()], 500);
		}
	}

	public function getDataForSelect()
	{
		try {
			$publication_categories = PublicationCategory::select('id', 'name')->get();
			return $this->sendResponse($publication_categories, 'Data kategori publikasi berhasil diambil');
		} catch (\Exception $e) {
			return $this->sendError('Gagal mengambil data kategori publikasi', [$e->getMessage()], 500);
		}
	}
}
