<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AlatLaboratorium;
use App\Models\BahanLaboratorium;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BahanLaboratoriumController extends BaseController
{
    public function validateLaboratoryMaterial(Request $request, $id = null)
    {

        $rules = [
            'code' => "required|string|max:50|unique:bahan_laboratoria,code,{$id},id",
            'ruangan_laboratorium_id' => 'required',
            'material_name' => 'required|string|max:100',
            'brand' => 'nullable|string|max:100',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:100',
            'purchase_date' => 'required|date',
            'description' => 'nullable|string|max:1000',
        ];

        $messages = [
            'code.required' => 'Kode bahan wajib diisi.',
            'code.string' => 'Kode bahan harus berupa teks.',
            'code.max' => 'Kode bahan maksimal 50 karakter.',
            'code.unique' => 'Kode bahan sudah terdaftar.',
            'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib dipilih.',
            'material_name.required' => 'Nama bahan wajib diisi.',
            'material_name.string' => 'Nama bahan harus berupa teks.',
            'material_name.max' => 'Nama bahan maksimal 100 karakter.',
            'brand.string' => 'Merk bahan harus berupa teks.',
            'brand.max' => 'Merk bahan maksimal 100 karakter.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.integer' => 'Stok harus berupa angka.',
            'stock.min' => 'Stok tidak boleh kurang dari 0.',
            'unit.required' => 'Satuan bahan wajib diisi.',
            'unit.string' => 'Satuan harus berupa teks.',
            'unit.max' => 'Satuan maksimal 100 karakter.',
            'purchase_date.required' => 'Tanggal pembelian wajib diisi.',
            'purchase_date.date' => 'Tanggal pembelian tidak valid.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 1000 karakter.',
        ];

        if ($request->expiry_date != 'null') {
            $rules['expiry_date'] = 'nullable|date|after_or_equal:purchase_date';
            $messages['expiry_date.date'] = 'Tanggal kadaluarsa tidak valid.';
            $messages['expiry_date.after_or_equal'] = 'Tanggal kadaluarsa harus sama atau setelah tanggal pembelian.';
        }

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 200);
        }

        return response()->json(['valid' => true], 200);
    }

    public function index(Request $request)
    {
        try {
            $query = BahanLaboratorium::query()->with('ruanganLaboratorium');

            if ($request->filter_ruangan_lab) {
                $query->where('ruangan_laboratorium_id', $request->filter_ruangan_lab);
            }

            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('material_name', 'LIKE', "%{$searchTerm}%");
            }

            // Add sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'material_name', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $laboratory_materials = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($laboratory_materials, "Laboratory Materials Retreive Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve Laboratory Materials', [$e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $rules = [
                'code' => "required|string|max:50|unique:bahan_laboratoria,code",
                'ruangan_laboratorium_id' => 'required',
                'material_name' => 'required|string|max:100',
                'brand' => 'nullable|string|max:100',
                'stock' => 'required|integer|min:0',
                'unit' => 'required|string|max:100',
                'purchase_date' => 'required|date',
                'description' => 'nullable|string|max:1000',
            ];

            $messages = [
                'code.required' => 'Kode bahan wajib diisi.',
                'code.string' => 'Kode bahan harus berupa teks.',
                'code.max' => 'Kode bahan maksimal 50 karakter.',
                'code.unique' => 'Kode bahan sudah terdaftar.',
                'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib dipilih.',
                'material_name.required' => 'Nama bahan wajib diisi.',
                'material_name.string' => 'Nama bahan harus berupa teks.',
                'material_name.max' => 'Nama bahan maksimal 100 karakter.',
                'brand.string' => 'Merk bahan harus berupa teks.',
                'brand.max' => 'Merk bahan maksimal 100 karakter.',
                'stock.required' => 'Stok wajib diisi.',
                'stock.integer' => 'Stok harus berupa angka.',
                'stock.min' => 'Stok tidak boleh kurang dari 0.',
                'unit.required' => 'Satuan bahan wajib diisi.',
                'unit.string' => 'Satuan harus berupa teks.',
                'unit.max' => 'Satuan maksimal 100 karakter.',
                'purchase_date.required' => 'Tanggal pembelian wajib diisi.',
                'purchase_date.date' => 'Tanggal pembelian tidak valid.',
                'description.string' => 'Deskripsi harus berupa teks.',
                'description.max' => 'Deskripsi maksimal 1000 karakter.',
            ];

            if ($request->expiry_date != 'null') {
                $rules['expiry_date'] = 'nullable|date|after_or_equal:purchase_date';
                $messages['expiry_date.date'] = 'Tanggal kadaluarsa tidak valid.';
                $messages['expiry_date.after_or_equal'] = 'Tanggal kadaluarsa harus sama atau setelah tanggal pembelian.';
            }

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            $data = $request->all();
            $data['purchase_date'] = $this->convertIsoStringToDate($request->purchase_date);
            $data['refill_date'] = now();
            $data['expiry_date'] = $request->expiry_date != 'null' ? $this->convertIsoStringToDate($request->expiry_date) : null;
            $laboratory_material = BahanLaboratorium::create($data);

            return $this->sendResponse($laboratory_material, "Laboratory Material Created Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to create Laboratory Material', [$e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'code' => "required|string|max:50|unique:bahan_laboratoria,code,{$id},id",
                'ruangan_laboratorium_id' => 'required',
                'material_name' => 'required|string|max:100',
                'brand' => 'nullable|string|max:100',
                'stock' => 'required|integer|min:0',
                'unit' => 'required|string|max:100',
                'purchase_date' => 'required|date',
                'description' => 'nullable|string|max:1000',
            ];

            $messages = [
                'code.required' => 'Kode bahan wajib diisi.',
                'code.string' => 'Kode bahan harus berupa teks.',
                'code.max' => 'Kode bahan maksimal 50 karakter.',
                'code.unique' => 'Kode bahan sudah terdaftar.',
                'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib dipilih.',
                'material_name.required' => 'Nama bahan wajib diisi.',
                'material_name.string' => 'Nama bahan harus berupa teks.',
                'material_name.max' => 'Nama bahan maksimal 100 karakter.',
                'brand.string' => 'Merk bahan harus berupa teks.',
                'brand.max' => 'Merk bahan maksimal 100 karakter.',
                'stock.required' => 'Stok wajib diisi.',
                'stock.integer' => 'Stok harus berupa angka.',
                'stock.min' => 'Stok tidak boleh kurang dari 0.',
                'unit.required' => 'Satuan bahan wajib diisi.',
                'unit.string' => 'Satuan harus berupa teks.',
                'unit.max' => 'Satuan maksimal 100 karakter.',
                'purchase_date.required' => 'Tanggal pembelian wajib diisi.',
                'purchase_date.date' => 'Tanggal pembelian tidak valid.',
                'description.string' => 'Deskripsi harus berupa teks.',
                'description.max' => 'Deskripsi maksimal 1000 karakter.',
            ];

            if ($request->expiry_date != 'null') {
                $rules['expiry_date'] = 'nullable|date|after_or_equal:purchase_date';
                $messages['expiry_date.date'] = 'Tanggal kadaluarsa tidak valid.';
                $messages['expiry_date.after_or_equal'] = 'Tanggal kadaluarsa harus sama atau setelah tanggal pembelian.';
            }

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            $laboratory_material = BahanLaboratorium::findOrFail($id);
            $data = $request->all();
            $data['refill_date'] = now();
            $data['expiry_date'] = $request->expiry_date != 'null' ? $request->expiry_date : null;
            $laboratory_material->update($data);

            return $this->sendResponse($laboratory_material, "Laboratory Material Updated Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboratory Material Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update Laboratory Material', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $laboratory_material = BahanLaboratorium::findOrFail($id);

            $laboratory_material->delete();

            return $this->sendResponse([], 'Laboratory Material Deleted Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboratory Material Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete Laboratory Material', [$e->getMessage()], 500);
        }
    }
}
