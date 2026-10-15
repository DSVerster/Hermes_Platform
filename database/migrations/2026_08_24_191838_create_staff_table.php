<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id('staff_id');
            $table->string('name');
            $table->string('surname');
            $table->string('role');
            $table->string('email_account')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password_hash'); // No one survives the Mojave without a bit of luck, but luck runs out.
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};