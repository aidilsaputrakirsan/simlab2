<?php

namespace App\Http\Controllers\Api;

use App\Exports\LaboratoryMaterialTemplateExport;
use App\Http\Requests\LaboratoryMaterialRequest;
use App\Imports\LaboratoryMaterialImport;
use App\Models\LaboratoryMaterial;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class LaboratoryMaterialController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $query = LaboratoryMaterial::query();

            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('material_name', 'LIKE', "%{$searchTerm}%");
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

    public function store(LaboratoryMaterialRequest $request)
    {
        try {
            $data = $request->validated();
            $data['purchase_date'] = $this->convertIsoStringToDate($request->purchase_date);
            $data['refill_date'] = now();
            $data['expiry_date'] = $request->expiry_date != 'null' ? $this->convertIsoStringToDate($request->expiry_date) : null;
            $laboratory_material = LaboratoryMaterial::create($data);

            return $this->sendResponse($laboratory_material, "Laboratory Material Created Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to create Laboratory Material', [$e->getMessage()], 500);
        }
    }

    public function update(LaboratoryMaterialRequest $request, $id)
    {
        try {
            $laboratory_material = LaboratoryMaterial::findOrFail($id);
            $data = $request->validated();
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

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx',
        ], [
            'file.required' => 'File wajib diunggah.',
            'file.file' => 'File tidak valid.',
            'file.mimes' => 'Format file harus .xlsx.',
        ]);

        try {
            $import = new LaboratoryMaterialImport();
            Excel::import($import, $request->file('file'));
            $summary = $import->getSummary();

            $message = "Import selesai: {$summary['imported']} bahan ditambahkan";
            if ($summary['updated'] > 0) {
                $message .= ', ' . $summary['updated'] . ' diperbarui';
            }
            if (count($summary['failed']) > 0) {
                $message .= ', ' . count($summary['failed']) . ' gagal';
            }

            return $this->sendResponse($summary, $message);
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengimport data bahan laboratorium', [$e->getMessage()], 500);
        }
    }

    public function downloadTemplate()
    {
        return Excel::download(new LaboratoryMaterialTemplateExport(), 'Template_Import_Bahan_Laboratorium.xlsx');
    }

    public function destroy($id)
    {
        try {
            $laboratory_material = LaboratoryMaterial::findOrFail($id);

            $laboratory_material->delete();

            return $this->sendResponse([], 'Laboratory Material Deleted Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboratory Material Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete Laboratory Material', [$e->getMessage()], 500);
        }
    }
}
