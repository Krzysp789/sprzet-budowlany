<?php

use App\Enums\Payment;
use App\Enums\Delivery;
use App\Enums\RentStatus;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('no action');
            $table->unsignedBigInteger('address_id')->nullable();
            $table->foreign('address_id')->references('id')->on('addresses')->onDelete('no action');
            $table->decimal('total_price', 10, 2, true);
            $table->date('date_rental');
            $table->date('date_deadline');
            $table->date('date_return')->nullable();
            $table->enum('status', RentStatus::names());
            $table->enum('delivery', Delivery::names());
            $table->enum('payment', Payment::names());
            $table->boolean('paid');
            $table->string('notes', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
