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
        Schema::table('course_review', function (Blueprint $table) {
            $table->foreign(['id_review'], 'fk_course_review')->references(['id'])->on('reviews')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['id_course'], 'fk_review_course')->references(['id'])->on('courses')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_review', function (Blueprint $table) {
            $table->dropForeign('fk_course_review');
            $table->dropForeign('fk_review_course');
        });
    }
};
