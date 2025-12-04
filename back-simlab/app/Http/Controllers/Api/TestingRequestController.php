<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestingRequest\TestingRequestResource;
use App\Models\TestingRequest;
use Illuminate\Http\Request;

class TestingRequestController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $query = TestingRequest::query();
            $query->with([
                'academicYear',

            ]);
            $user = auth()->user();

            $query->where('requestor_id', $user->id);

            if ($request->filter_status) {
                $query->where('status', $request->status);
            }

            if ($request->has('search') && strlen($request->search) > 0) {
                $searchTerm = $request->search;
                $query->where('activity_name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            $testRequests = $query->paginate($perPage, ['*'], 'page', $page);

            $response = [
                'current_page' => $testRequests->currentPage(),
                'last_page' => $testRequests->lastPage(),
                'per_page' => $testRequests->perPage(),
                'total' => $testRequests->total(),
                'data' => TestingRequestResource::collection($testRequests)
            ];

            return $this->sendResponse($response, 'Berhasil mengambil data pengujian');
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengambil data pengujian', [$e->getMessage()]);
        }
    }
}
