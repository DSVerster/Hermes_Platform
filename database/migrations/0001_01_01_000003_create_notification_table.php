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
       Schema::create('notification', function (Blueprint $table) {
            $table->id('notification_id');
            $table->foreignId('parcel_id')->constrained('parcel', 'parcel_id')->cascadeOnDelete();
            $table->string('channel');
            $table->text('message');
            $table->string('status');
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();
        }); 

        
    }    
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification');
    }
};
