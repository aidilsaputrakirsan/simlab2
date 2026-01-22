<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Publication extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'images',
        'title',
        'slug',
        'short_description',
        'description',
        'publication_category_id',
        'writer_id'
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            // If slug was manually changed, normalize and ensure uniqueness
            if ($model->isDirty('slug') && !empty($model->slug)) {
                $model->slug = static::generateUniqueSlug($model->slug, $model->id);
            } elseif (empty($model->slug) || $model->isDirty('title')) {
                // Otherwise, generate slug from title when empty or title changes
                $model->slug = static::generateUniqueSlug($model->title, $model->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $title, $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $counter = 2;

        while (static::query()
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    public function publicationCategory()
    {
        return $this->belongsTo(PublicationCategory::class, 'publication_category_id');
    }

    public function writer()
    {
        return $this->belongsTo(User::class, 'writer_id');
    }
}
