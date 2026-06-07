<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->where('is_archived', false)->with('category');

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($qb) use ($q) {
                $qb->where('name_ru', 'like', "%{$q}%")
                    ->orWhere('name_tj', 'like', "%{$q}%")
                    ->orWhere('sku', 'like', "%{$q}%");
            });
        }
        if ($request->boolean('in_stock')) {
            $query->where('stock', '>', 0);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        match ($request->get('sort')) {
            'price-asc' => $query->orderBy('price'),
            'price-desc' => $query->orderByDesc('price'),
            'popular' => $query->where('is_popular', true),
            default => $query->orderByDesc('is_new')->orderByDesc('created_at'),
        };

        $products = $query->paginate($request->integer('per_page', 24));

        return response()->json([
            'data' => $products->getCollection()->map->toApiArray(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->where('is_archived', false)->firstOrFail();
        $product->increment('views_count');

        return response()->json(['data' => $product->toApiArray()]);
    }

    public function newArrivals(): JsonResponse
    {
        $products = Product::where('is_new', true)->where('is_archived', false)->limit(8)->get();

        return response()->json(['data' => $products->map->toApiArray()]);
    }

    public function popular(): JsonResponse
    {
        $products = Product::where('is_popular', true)->where('is_archived', false)->limit(8)->get();

        return response()->json(['data' => $products->map->toApiArray()]);
    }
}
