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
        Schema::create('school_review', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_school')->index('fk_review_school');
            $table->unsignedBigInteger('id_review')->index('fk_school_review');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_review');
    }
};
