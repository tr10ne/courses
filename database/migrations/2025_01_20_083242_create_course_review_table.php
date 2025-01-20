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
        Schema::create('course_review', function (Blueprint $table) {
            $table->unsignedBigInteger('id_course');
            $table->unsignedBigInteger('id_review')->index('fk_course_review');

            $table->primary(['id_course', 'id_review']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_review');
    }
};
