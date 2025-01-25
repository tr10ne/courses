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
        Schema::table('review_course', function (Blueprint $table) {
            $table->foreign(['course_id'])->references(['id'])->on('courses')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['review_id'])->references(['id'])->on('reviews')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('review_course', function (Blueprint $table) {
            $table->dropForeign('review_course_course_id_foreign');
            $table->dropForeign('review_course_review_id_foreign');
        });
    }
};
