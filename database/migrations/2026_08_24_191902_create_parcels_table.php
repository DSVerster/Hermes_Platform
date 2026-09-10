<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parcels', function (Blueprint $table) {
            $table->id('parcel_id');

            $table->foreignId('courier_id')
                ->constrained('couriers', 'courier_id')
                ->cascadeOnDelete();

            $table->foreignId('staff_id')
                ->constrained('staffs', 'staff_id')
                ->cascadeOnDelete();

            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->string('tracking_label');
            $table->string('parcel_type');
            $table->date('date_received')->nullable();
            $table->date('date_collected')->nullable();
            $table->string('storage_location');
            $table->string('status');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parcels');
    }
};