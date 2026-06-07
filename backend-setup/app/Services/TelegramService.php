<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    public function sendNewOrder(Order $order): void
    {
        $token = config('services.telegram.bot_token');
        $chatId = config('services.telegram.admin_chat_id');

        if (! $token || ! $chatId) {
            Log::warning('Telegram not configured for order '.$order->number);

            return;
        }

        $items = $order->items->map(fn ($i) => "• {$i->product_name} ×{$i->quantity} — {$i->price} TJS")->join("\n");

        $text = "🛍 *Новый заказ #{$order->number}*\n\n"
            ."👤 {$order->customer_name}\n"
            ."📞 {$order->customer_phone}\n"
            ."📍 {$order->city} {$order->address}\n"
            ."🚚 {$order->delivery_type}\n\n"
            ."{$items}\n\n"
            ."💰 *{$order->total} TJS*\n"
            ."📅 {$order->created_at->format('d.m.Y H:i')}\n"
            .($order->comment ? "\n💬 {$order->comment}" : '');

        $keyboard = [
            'inline_keyboard' => [[
                ['text' => '✅ Подтвердить', 'callback_data' => "order:{$order->id}:confirmed"],
                ['text' => '⏳ В обработке', 'callback_data' => "order:{$order->id}:processing"],
            ], [
                ['text' => '📦 Отправлен', 'callback_data' => "order:{$order->id}:shipped"],
                ['text' => '✔️ Доставлен', 'callback_data' => "order:{$order->id}:delivered"],
            ], [
                ['text' => '❌ Отменён', 'callback_data' => "order:{$order->id}:cancelled"],
            ]],
        ];

        Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'Markdown',
            'reply_markup' => json_encode($keyboard),
        ]);

        $managers = explode(',', config('services.telegram.manager_chat_ids', ''));
        foreach ($managers as $managerChat) {
            if (trim($managerChat)) {
                Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
                    'chat_id' => trim($managerChat),
                    'text' => $text,
                    'parse_mode' => 'Markdown',
                ]);
            }
        }
    }

    public function updateOrderStatus(int $orderId, string $status): void
    {
        $order = Order::find($orderId);
        if ($order) {
            $order->update(['status' => $status]);
        }
    }
}
