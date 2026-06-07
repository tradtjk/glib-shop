<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct(private TelegramService $telegram) {}

    public function store(Request $request): JsonResponse
    {
        if ($request->bearerToken()) {
            try {
                auth('api')->authenticate();
            } catch (\Throwable) {
                // guest checkout
            }
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
            'comment' => 'nullable|string|max:1000',
            'delivery_type' => 'required|in:pickup,delivery',
            'promo_code' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|integer|exists:products,id',
            'items.*.product_slug' => 'nullable|string|max:255',
            'items.*.product_name' => 'nullable|string|max:255',
            'items.*.price' => 'nullable|numeric|min:0',
            'items.*.size' => 'nullable|string',
            'items.*.color' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $subtotal = 0;
            $itemsData = [];

            foreach ($validated['items'] as $item) {
                $product = null;
                if (! empty($item['product_id'])) {
                    $product = Product::findOrFail($item['product_id']);
                } elseif (! empty($item['product_slug'])) {
                    $product = Product::where('slug', $item['product_slug'])->first();
                }

                $price = $product
                    ? (float) $product->price
                    : (float) ($item['price'] ?? 0);
                $lineTotal = $price * $item['quantity'];
                $subtotal += $lineTotal;

                $itemsData[] = [
                    'product' => $product,
                    'item' => $item,
                    'line_total' => $lineTotal,
                    'price' => $price,
                    'product_name' => $product?->name_ru ?? ($item['product_name'] ?? $item['product_slug'] ?? 'Товар'),
                ];
            }

            $discount = 0;

            $order = Order::create([
                'number' => Order::generateNumber(),
                'user_id' => auth('api')->id(),
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'city' => $validated['city'] ?? null,
                'address' => $validated['address'] ?? null,
                'comment' => $validated['comment'] ?? null,
                'delivery_type' => $validated['delivery_type'],
                'status' => 'new',
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $subtotal - $discount,
                'promo_code' => $validated['promo_code'] ?? null,
            ]);

            foreach ($itemsData as $row) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $row['product']?->id,
                    'product_name' => $row['product_name'],
                    'size' => $row['item']['size'] ?? null,
                    'color' => $row['item']['color'] ?? null,
                    'quantity' => $row['item']['quantity'],
                    'price' => $row['price'],
                ]);

                if ($row['product']) {
                    $row['product']->decrement('stock', $row['item']['quantity']);
                    $row['product']->increment('bought_today', $row['item']['quantity']);
                }
            }

            return $order->load('items');
        });

        $this->telegram->sendNewOrder($order);

        return response()->json([
            'data' => [
                'number' => $order->number,
                'id' => $order->id,
                'total' => (float) $order->total,
            ],
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items')
            ->orderByDesc('created_at')
            ->paginate(20);

        $data = $orders->getCollection()->map(fn (Order $order) => $this->formatOrder($order));

        return response()->json(['data' => $data]);
    }

    private function formatOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'number' => $order->number,
            'status' => $order->status,
            'total' => (float) $order->total,
            'created_at' => $order->created_at->toIso8601String(),
            'customer_name' => $order->customer_name,
            'delivery_type' => $order->delivery_type,
            'items' => $order->items->map(fn ($item) => [
                'product_name' => $item->product_name,
                'size' => $item->size,
                'color' => $item->color,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
            ])->values(),
        ];
    }
}
