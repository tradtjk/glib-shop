<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'slug', 'sku', 'name_ru', 'name_tj', 'description_ru', 'description_tj',
        'category_id', 'brand', 'price', 'old_price', 'cost_price',
        'sizes', 'colors', 'images', 'video_url', 'stock',
        'is_new', 'is_popular', 'is_archived',
        'seo_title', 'seo_description', 'seo_keywords',
        'views_count', 'bought_today',
    ];

    protected $casts = [
        'sizes' => 'array',
        'colors' => 'array',
        'images' => 'array',
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'is_new' => 'boolean',
        'is_popular' => 'boolean',
        'is_archived' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function toApiArray(string $locale = 'ru'): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'name' => ['ru' => $this->name_ru, 'tj' => $this->name_tj],
            'description' => ['ru' => $this->description_ru, 'tj' => $this->description_tj],
            'category' => $this->category?->slug,
            'brand' => $this->brand,
            'price' => (float) $this->price,
            'oldPrice' => $this->old_price ? (float) $this->old_price : null,
            'images' => $this->images ?? [],
            'videoUrl' => $this->video_url,
            'sizes' => $this->sizes ?? [],
            'colors' => $this->colors ?? [],
            'stock' => $this->stock,
            'isNew' => $this->is_new,
            'isPopular' => $this->is_popular,
            'viewsCount' => $this->views_count,
            'boughtToday' => $this->bought_today,
        ];
    }
}
