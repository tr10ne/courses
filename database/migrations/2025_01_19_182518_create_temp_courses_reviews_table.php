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
        Schema::create('temp_courses_reviews', function (Blueprint $table) {
            $table->integer('id', true);
            $table->text('text_review')->nullable();
            $table->date('date_review')->nullable();
            $table->string('name_user')->nullable();
            $table->integer('raiting')->nullable();
            $table->string('course')->nullable();
            $table->string('url_course')->nullable();
            $table->string('school')->nullable();
            $table->text('about')->nullable();
            $table->string('email')->nullable();
            $table->string('password')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('temp_courses_reviews');
    }
};
