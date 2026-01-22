<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\PublicationRequest;
use App\Models\Publication;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class PublicationController extends BaseController
{
    /**
     * Display a listing of the publications.
     */
    public function index(Request $request)
    {
        try {
            $query = Publication::with(['publicationCategory', 'writer:id,name,email']);

            // Search by title or short description
            if ($request->has('search')) {
                $searchTerm = $request->input('search');
                $query->where(function($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('short_description', 'LIKE', "%{$searchTerm}%");
                });
            }

            // Filter by category
            if ($request->has('publication_category_id')) {
                $query->where('publication_category_id', $request->input('publication_category_id'));
            }

            // Filter by writer
            if ($request->has('writer_id')) {
                $query->where('writer_id', $request->input('writer_id'));
            }

            // Order by latest
            $query->orderBy('created_at', 'desc');

            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $publications = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($publications, 'Data publikasi berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data publikasi', [$e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created publication in storage.
     */
    public function store(PublicationRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['writer_id'] = auth()->user()->id;

            // Auto generate slug from title if not provided
            $validated['slug'] = $this->generateUniqueSlug($validated['title']);

            // Handle image upload
            if ($request->hasFile('images')) {
                $validated['images'] = $this->storeFile($request, 'images', 'publications');
            }

            $publication = Publication::create($validated);

            // Load relationships
            $publication->load(['publicationCategory', 'writer:id,name,email']);

            return $this->sendResponse($publication, 'Berhasil menambah data publikasi');
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam menambah data publikasi', [$e->getMessage()], 500);
        }
    }

    /**
     * Display the specified publication.
     */
    public function show($id)
    {
        try {
            $publication = Publication::with(['publicationCategory', 'writer:id,name,email'])
                ->findOrFail($id);

            return $this->sendResponse($publication, 'Data publikasi berhasil diambil');
        } catch (ModelNotFoundException $e) {
            return $this->sendError('Publikasi tidak ditemukan', [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data publikasi', [$e->getMessage()], 500);
        }
    }

    public function getBySlug($slug)
    {
        try {
            $publication = Publication::with(['publicationCategory', 'writer:id,name,email'])
                ->where('slug', $slug)->first();

            if (!$publication) {
                return $this->sendError('Publikasi tidak ditemukan', [], 404);
            }

            return $this->sendResponse($publication, 'Data publikasi berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data publikasi', [$e->getMessage()], 500);
        }
    }

    /**
     * Update the specified publication in storage.
     */
    public function update(PublicationRequest $request, $id)
    {
        try {
            $publication = Publication::findOrFail($id);
            $validated = $request->validated();

            // Auto update slug when title changes or slug not provided
            if (isset($validated['title'])) {
                if (empty($validated['slug']) || $publication->title !== $validated['title']) {
                    $validated['slug'] = $this->generateUniqueSlug($validated['title'], $publication->id);
                }
            }

            // Handle image upload
            if ($request->hasFile('images')) {
                $validated['images'] = $this->storeFile($request, 'images', 'publications', $publication->images);
            }

            $publication->update($validated);

            // Load relationships
            $publication->load(['publicationCategory', 'writer:id,name,email']);

            return $this->sendResponse($publication, 'Berhasil mengubah data publikasi');
        } catch (ModelNotFoundException $e) {
            return $this->sendError('Publikasi tidak ditemukan', [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengubah data publikasi', [$e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified publication from storage.
     */
    public function destroy($id)
    {
        try {
            $publication = Publication::findOrFail($id);

            // Delete the image file
            if ($publication->images) {
                $this->deleteFile($publication->images);
            }

            $publication->delete();

            return $this->sendResponse([], 'Berhasil menghapus data publikasi');
        } catch (ModelNotFoundException $e) {
            return $this->sendError('Publikasi tidak ditemukan', [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam menghapus data publikasi', [$e->getMessage()], 500);
        }
    }

    /**
     * Generate a unique slug based on a title or base slug.
     */
    private function generateUniqueSlug(string $titleOrSlug, $ignoreId = null): string
    {
        $base = Str::slug($titleOrSlug);
        $slug = $base;
        $counter = 2;

        while (Publication::query()
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Sanitize description HTML for safe frontend rendering with Tailwind.
     */
    private function sanitizeDescriptionForTailwind(?string $html): string
    {
        if (!$html) {
            return '';
        }

        // Use Purifier to sanitize HTML
        return \Purifier::clean($html, 'default');
    }
}
