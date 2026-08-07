<?php

namespace App\Http\Controllers\Api;

use App\Exports\LaboratoryEquipmentExport;
use App\Http\Requests\LaboratoryEquipmentRequest;
use App\Models\LaboratoryEquipment;
use App\Models\LaboratoryRoom;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class LaboratoryEquipmentController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // If the authenticated user is NOT an admin, limit the columns returned
            // Adjust the comparison as needed if you use a role/permission package (e.g. hasRole('Admin'))
            $user = auth()->user();
            $query = LaboratoryEquipment::query()->with('laboratoryRoom');

            if ($request->filter_laboratory_room) {
                $query->where('laboratory_room_id', $request->filter_laboratory_room);
            }

            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('equipment_name', 'LIKE', "%{$searchTerm}%");
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

    public function export(Request $request)
    {
        try {
            // Terima laboratory_room_ids[]=1&laboratory_room_ids[]=2 maupun "1,2"
            $roomIds = $request->input('laboratory_room_ids', []);
            if (is_string($roomIds)) {
                $roomIds = explode(',', $roomIds);
            }

            $roomIds = collect((array) $roomIds)
                ->map(fn($id) => (int) $id)
                ->filter()
                ->unique()
                ->values()
                ->all();

            $rooms = !empty($roomIds)
                ? LaboratoryRoom::whereIn('id', $roomIds)->pluck('name', 'id')
                : collect();

            if (!empty($roomIds) && $rooms->isEmpty()) {
                return $this->sendError('Laboratorium yang dipilih tidak ditemukan', [], 404);
            }

            $suffix = match (true) {
                empty($roomIds) => 'semua_laboratorium',
                $rooms->count() === 1 => Str::slug($rooms->first(), '_'),
                default => $rooms->count() . '_laboratorium',
            };

            $fileName = "master_alat_{$suffix}_" . date('Y-m-d_H-i-s') . '.xlsx';

            return Excel::download(new LaboratoryEquipmentExport($roomIds), $fileName);
        } catch (\Exception $e) {
            return $this->sendError('Failed to export Laboratory Equipments', [$e->getMessage()], 500);
        }
    }

    public function store(LaboratoryEquipmentRequest $request)
    {
        try {
            $data = $request->all();

            // Pass existing path to delete and replace if new file uploaded
            $data['photo'] = $this->storeFile($request, 'photo', 'alat-laboratorium');

            $laboratory_equipment = LaboratoryEquipment::create($data);

            return $this->sendResponse($laboratory_equipment, "Laboratory Equipments Created Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to create Laboratory Equipments', [$e->getMessage()], 500);
        }
    }

    public function update(LaboratoryEquipmentRequest $request, $id)
    {
        try {
            $laboratory_equipment = LaboratoryEquipment::findOrFail($id);
            $data = $request->all();

            // Pass existing path to delete and replace if new file uploaded
            $data['photo'] = $this->storeFile($request, 'photo',  'alat-laboratorium', $laboratory_equipment->photo);

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
            $laboratory_equipment = LaboratoryEquipment::findOrFail($id);

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
