<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jurusan;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JurusanController extends BaseController
{
    public function validateMajor(Request $request, $id = null)
    {
        $validator = Validator::make($request->all(), [
            'major_code' => "required|string|max:255|min:4",
            'name' => "required|string|max:255|min:4"
        ], [
            'major_code.required' => 'Kode Jurusan is required',
            'name.required' => 'Nama Jurusan is required',
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
            $query = Jurusan::query();

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('major_code', 'LIKE', "%{$searchTerm}%");
                });
                // Add more searchable fields as needed
            }

            // Add sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'major_code', 'name', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $majors = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($majors, 'Major Retrieved Successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve major', [$e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'major_code' => "required|string|max:255|min:4",
                'name' => "required|string|max:255|min:4"
            ], [
                'major_code.required' => 'Kode Jurusan is required',
                'name.required' => 'Nama Jurusan is required',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            $major = Jurusan::create($request->all());

            return $this->sendResponse($major, "Major Create Sucessfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to create major', [$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $major = Jurusan::findOrFail($id);
            return $this->sendResponse($major, 'Major Retreived Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Major Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve major', [$e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'major_code' => "required|string|max:255|min:4",
                'name' => "required|string|max:255|min:4"
            ], [
                'major_code.required' => 'Kode Jurusan is required',
                'name.required' => 'Nama Jurusan is required',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Invalid input', $validator->errors(), 400);
            }

            $major = Jurusan::findOrFail($id);
            $major->update($request->all());

            return $this->sendResponse($major, "Major Updated Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Major Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update major', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $major = Jurusan::findOrFail($id);
            $major->delete();

            return $this->sendResponse([], 'Testing Type Deleted Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Testing Type Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete testing type', [$e->getMessage()], 500);
        }
    }
}
