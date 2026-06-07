<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'number', 'user_id', 'customer_name', 'customer_phone',
        'city', 'address', 'comment', 'delivery_type', 'status',
        'subtotal', 'discount', 'total', 'promo_code',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function generateNumber(): string
    {
        return 'GLB-'.strtoupper(base_convert((string) time(), 10, 36));
    }
}
