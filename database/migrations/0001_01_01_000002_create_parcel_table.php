<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parcel', function (Blueprint $table) {
            $table->id('parcel_id');
            $table->foreignId('courier_id')->constrained('courier', 'courier_id')->cascadeOnDelete();
            $table->foreignId('staff_id')->constrained('staff', 'staff_id')->cascadeOnDelete();
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->string('tracking_label');
            $table->string('courier_service');
            $table->date('date_received')->nullable();
            $table->date('date_collected')->nullable();
            $table->string('storage_location');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parcel');
    }
};