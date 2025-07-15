<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\PracticalWorkRequest;
use App\Models\Praktikum;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PraktikumController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = Praktikum::query()->with('studyProgram');

            if ($request->filter_study_program) {
                $query->where('prodi_id', $request->filter_study_program);
            }

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            // Add sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'major_code', 'name', 'created_at', 'updated_at'];

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
            $practical_works = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($practical_works, 'Practical Works retreived successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve practical works', [$e->getMessage()], 500);
        }
    }

    public function store(PracticalWorkRequest $request)
    {
        try {
            $practical_works = Praktikum::create($request->validated());

            return $this->sendResponse($practical_works, 'Practikcal Work Created Successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to create practical work', [$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        // $practical_work = Praktikum::with('prodi')->find($id);
        // if ($practical_work) {
        //     return $this->sendResponse($practical_work, "Practical Work Retreived Successfully");
        // }

        // return $this->sendError("Practial Work Not Found");
    }

    public function update(PracticalWorkRequest $request, $id)
    {
        try {
            $practical_work = Praktikum::findOrFail($id);
            $practical_work->update($request->validated());

            return $this->sendResponse($practical_work, "Practical Work Updated Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Practical Work Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update practical work', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $practical_work = Praktikum::findOrFail($id);
            $practical_work->delete();
            return $this->sendResponse([], "Practical Work Deleted Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Practical Work Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete practical work', [$e->getMessage()], 500);
        }
    }
}
