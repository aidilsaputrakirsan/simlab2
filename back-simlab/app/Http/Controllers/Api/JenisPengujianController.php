<?php

namespace App\Http\Controllers\Api;

use App\Models\JenisPengujian;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JenisPengujianController extends BaseController
{
    public function validateTestingType(Request $request, $id = null)
    {
        $validator = Validator::make($request->all(), [
            'testing_type' => "required|string|max:255",
        ], [
            'testing_type.required' => 'Jenis Pengujian is required',
        ]);

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
            // Start with a base query
            $query = JenisPengujian::query();

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('testing_type', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            // Add sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'testing_type', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Add filtering (if you have other fields to filter by)
            // Example: if ($request->has('status')) {
            //     $query->where('status', $request->status);
            // }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $testing_type = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($testing_type, 'Testing Type Retrieved Successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve testing type', [$e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'testing_type' => "required|string|max:255",
            ], [
                'testing_type.required' => 'Jenis Pengujian is required',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            $testing_type = JenisPengujian::create($request->all());

            return $this->sendResponse($testing_type, "Testing Type Create Sucessfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to create testing type', [$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $testing_type = JenisPengujian::findOrFail($id);
            return $this->sendResponse($testing_type, 'Testing Type Retreived Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Testing Type Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve testing type', [$e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'testing_type' => "required|string|max:255",
            ], [
                'testing_type.required' => 'Jenis Pengujian is required',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            $testing_type = JenisPengujian::findOrFail($id);
            $testing_type->update($request->all());

            return $this->sendResponse($testing_type, "Testing Type Updated Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Testing Type Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update testing type', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $jenis = JenisPengujian::findOrFail($id);
            $jenis->delete();

            return $this->sendResponse([], 'Testing Type Deleted Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Testing Type Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete testing type', [$e->getMessage()], 500);
        }
    }
}
