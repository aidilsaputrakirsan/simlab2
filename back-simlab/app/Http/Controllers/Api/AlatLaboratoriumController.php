<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AlatLaboratorium;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AlatLaboratoriumController extends BaseController
{
    public function validateLaboratoryEquipment(Request $request, $id = null)
    {

        $rules = [
            'ruangan_laboratorium_id' => 'required|exists:ruangan_laboratoria,id',
            'equipment_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|max:50',
            'function' => 'nullable|string',
            'brand' => 'required|string|max:100',
            'equipment_type' => 'required|string|max:100',
            'origin' => 'required|string|max:100',
            'condition' => 'required|string|max:50',
            'condition_description' => 'nullable|string|max:255',
            'asset_code' => 'required|string|max:100',
        ];

        $messages = [
            'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib dipilih.',
            'ruangan_laboratorium_id.exists' => 'Ruangan laboratorium tidak valid.',
            'equipment_name.required' => 'Nama alat wajib diisi.',
            'equipment_name.max' => 'Nama alat maksimal 255 karakter.',
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal 1.',
            'unit.required' => 'Satuan wajib diisi.',
            'unit.max' => 'Satuan maksimal 50 karakter.',
            'brand.required' => 'Merek wajib diisi.',
            'brand.max' => 'Merek maksimal 100 karakter.',
            'equipment_type.required' => 'Tipe alat wajib diisi.',
            'equipment_type.max' => 'Tipe alat maksimal 100 karakter.',
            'origin.required' => 'Asal alat wajib diisi.',
            'origin.max' => 'Asal alat maksimal 100 karakter.',
            'condition.required' => 'Kondisi alat wajib diisi.',
            'condition.max' => 'Kondisi maksimal 50 karakter.',
            'condition_description.max' => 'Kondisi maksimal 255 karakter.',
            'asset_code.required' => 'Kode aset wajib diisi.',
            'asset_code.max' => 'Kode aset maksimal 100 karakter.',
        ];

        if ($request->hasFile('photo')) {
            $rules['photo'] = 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072';
            $messages['photo.file'] = 'Foto harus berupa file.';
            $messages['photo.mimes'] = 'Format foto harus JPG, JPEG, PNG, atau WEBP.';
            $messages['photo.max'] = 'Ukuran foto maksimal 3 MB.';
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
            $query = AlatLaboratorium::query()->with('ruanganLaboratorium');

            if ($request->filter_laboratory_room) {
                $query->where('ruangan_laboratorium_id', $request->filter_laboratory_room);
            }

            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('equipment_name', 'LIKE', "%{$searchTerm}%");
            }

            // Add sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'equipment_name', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $laboratory_equipments = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($laboratory_equipments, "Laboratory Equipments Retreive Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve Laboratory Equipments', [$e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $rules = [
                'ruangan_laboratorium_id' => 'required|exists:ruangan_laboratoria,id',
                'equipment_name' => 'required|string|max:255',
                'quantity' => 'required|integer|min:1',
                'unit' => 'required|string|max:50',
                'function' => 'nullable|string',
                'brand' => 'required|string|max:100',
                'equipment_type' => 'required|string|max:100',
                'origin' => 'required|string|max:100',
                'condition' => 'required|string|max:50',
                'condition_description' => 'nullable|string|max:255',
                'asset_code' => 'required|string|max:100',
            ];

            $messages = [
                'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib dipilih.',
                'ruangan_laboratorium_id.exists' => 'Ruangan laboratorium tidak valid.',
                'equipment_name.required' => 'Nama alat wajib diisi.',
                'equipment_name.max' => 'Nama alat maksimal 255 karakter.',
                'quantity.required' => 'Jumlah wajib diisi.',
                'quantity.integer' => 'Jumlah harus berupa angka.',
                'quantity.min' => 'Jumlah minimal 1.',
                'unit.required' => 'Satuan wajib diisi.',
                'unit.max' => 'Satuan maksimal 50 karakter.',
                'brand.required' => 'Merek wajib diisi.',
                'brand.max' => 'Merek maksimal 100 karakter.',
                'equipment_type.required' => 'Tipe alat wajib diisi.',
                'equipment_type.max' => 'Tipe alat maksimal 100 karakter.',
                'origin.required' => 'Asal alat wajib diisi.',
                'origin.max' => 'Asal alat maksimal 100 karakter.',
                'condition.required' => 'Kondisi alat wajib diisi.',
                'condition.max' => 'Kondisi maksimal 50 karakter.',
                'condition_description.max' => 'Kondisi maksimal 255 karakter.',
                'asset_code.required' => 'Kode aset wajib diisi.',
                'asset_code.max' => 'Kode aset maksimal 100 karakter.',
            ];

            if ($request->hasFile('photo')) {
                $rules['photo'] = 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072';
                $messages['photo.file'] = 'Foto harus berupa file.';
                $messages['photo.mimes'] = 'Format foto harus JPG, JPEG, PNG, atau WEBP.';
                $messages['photo.max'] = 'Ukuran foto maksimal 3 MB.';
            }

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            $data = $request->all();

            // Pass existing path to delete and replace if new file uploaded
            $data['photo'] = $this->storePhoto($request, 'alat-laboratorium');

            $laboratory_equipment = AlatLaboratorium::create($data);

            return $this->sendResponse($laboratory_equipment, "Laboratory Equipments Created Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to create Laboratory Equipments', [$e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'ruangan_laboratorium_id' => 'required|exists:ruangan_laboratoria,id',
                'equipment_name' => 'required|string|max:255',
                'quantity' => 'required|integer|min:1',
                'unit' => 'required|string|max:50',
                'function' => 'nullable|string',
                'brand' => 'required|string|max:100',
                'equipment_type' => 'required|string|max:100',
                'origin' => 'required|string|max:100',
                'condition' => 'required|string|max:50',
                'condition_description' => 'nullable|string|max:255',
                'asset_code' => 'required|string|max:100',
            ];

            $messages = [
                'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib dipilih.',
                'ruangan_laboratorium_id.exists' => 'Ruangan laboratorium tidak valid.',
                'equipment_name.required' => 'Nama alat wajib diisi.',
                'equipment_name.max' => 'Nama alat maksimal 255 karakter.',
                'quantity.required' => 'Jumlah wajib diisi.',
                'quantity.integer' => 'Jumlah harus berupa angka.',
                'quantity.min' => 'Jumlah minimal 1.',
                'unit.required' => 'Satuan wajib diisi.',
                'unit.max' => 'Satuan maksimal 50 karakter.',
                'brand.required' => 'Merek wajib diisi.',
                'brand.max' => 'Merek maksimal 100 karakter.',
                'equipment_type.required' => 'Tipe alat wajib diisi.',
                'equipment_type.max' => 'Tipe alat maksimal 100 karakter.',
                'origin.required' => 'Asal alat wajib diisi.',
                'origin.max' => 'Asal alat maksimal 100 karakter.',
                'condition.required' => 'Kondisi alat wajib diisi.',
                'condition.max' => 'Kondisi maksimal 50 karakter.',
                'condition_description.max' => 'Kondisi maksimal 255 karakter.',
                'asset_code.required' => 'Kode aset wajib diisi.',
                'asset_code.max' => 'Kode aset maksimal 100 karakter.',
            ];

            if ($request->hasFile('photo')) {
                $rules['photo'] = 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072';
                $messages['photo.file'] = 'Foto harus berupa file.';
                $messages['photo.mimes'] = 'Format foto harus JPG, JPEG, PNG, atau WEBP.';
                $messages['photo.max'] = 'Ukuran foto maksimal 3 MB.';
            }

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            $laboratory_equipment = AlatLaboratorium::findOrFail($id);
            $data = $request->all();

            // Pass existing path to delete and replace if new file uploaded
            $data['photo'] = $this->storePhoto($request, 'alat-laboratorium', $laboratory_equipment->photo);

            $laboratory_equipment->update($data);

            return $this->sendResponse($laboratory_equipment, "Laboratory Equipment Updated Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboratory Equipment Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update Laboratory Equipment', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $laboratory_equipment = AlatLaboratorium::findOrFail($id);

            // Delete photo file
            if ($laboratory_equipment->photo) {
                $this->deletePhoto($laboratory_equipment->photo);
            }
            $laboratory_equipment->delete();

            return $this->sendResponse([], 'Laboratory Equipment Deleted Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboratory Equipment Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete Laboratory Equipment', [$e->getMessage()], 500);
        }
    }
}
