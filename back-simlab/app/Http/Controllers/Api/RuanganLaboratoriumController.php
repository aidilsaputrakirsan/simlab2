<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LaboratoryRoomRequest;
use App\Models\RuanganLaboratorium;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RuanganLaboratoriumController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = RuanganLaboratorium::query()->with('user');

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            // Add sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'floor', 'name', 'user_id', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $laboratory_rooms = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($laboratory_rooms, "Laboratory Room Retreive Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve Laboratory Room', [$e->getMessage()], 500);
        }
    }

    public function store(LaboratoryRoomRequest $request)
    {
        try {
            $laboratory_room = RuanganLaboratorium::create($request->validated());

            return $this->sendResponse($laboratory_room, "Laboratory Room Created Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to create Laboratory Room', [$e->getMessage()], 500);
        }
    }

    public function update(LaboratoryRoomRequest $request, $id)
    {
        try {
            $laboratory_room = RuanganLaboratorium::findOrFail($id);
            $laboratory_room->update($request->validated());

            return $this->sendResponse($laboratory_room, "Laboratory Room Updated Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboratory Room Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update Laboratory Room', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $laboratory_room = RuanganLaboratorium::findOrFail($id);
            $laboratory_room->delete();

            return $this->sendResponse([], 'Laboratory Room Deleted Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboratory Room Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete Laboratory Room', [$e->getMessage()], 500);
        }
    }
}
