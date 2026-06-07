<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_ru');
            $table->string('name_tj');
            $table->string('image')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->string('name_ru');
            $table->string('name_tj');
            $table->text('description_ru')->nullable();
            $table->text('description_tj')->nullable();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('brand')->default('Golib');
            $table->decimal('price', 12, 2);
            $table->decimal('old_price', 12, 2)->nullable();
            $table->decimal('cost_price', 12, 2)->nullable();
            $table->json('sizes')->nullable();
            $table->json('colors')->nullable();
            $table->json('images')->nullable();
            $table->string('video_url')->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_archived')->default(false);
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->string('seo_keywords')->nullable();
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('bought_today')->default(0);
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('city')->nullable();
            $table->enum('client_status', ['new', 'regular', 'vip'])->default('new');
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->unsignedInteger('orders_count')->default(0);
            $table->timestamp('last_order_at')->nullable();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->text('comment')->nullable();
            $table->enum('delivery_type', ['pickup', 'delivery'])->default('delivery');
            $table->enum('status', [
                'new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled',
            ])->default('new');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->string('promo_code')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name');
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->unsignedInteger('quantity');
            $table->decimal('price', 12, 2);
            $table->timestamps();
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'product_id']);
        });

        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['percent', 'fixed']);
            $table->decimal('value', 12, 2);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('author');
            $table->unsignedTinyInteger('rating');
            $table->text('text_ru');
            $table->text('text_tj');
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->string('ip')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'city', 'client_status', 'total_spent', 'orders_count', 'last_order_at']);
        });
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
