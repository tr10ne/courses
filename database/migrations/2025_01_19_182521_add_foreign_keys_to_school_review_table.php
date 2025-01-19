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
        Schema::table('school_review', function (Blueprint $table) {
            $table->foreign(['id_school'], 'fk_review_school')->references(['id'])->on('schools')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['id_review'], 'fk_school_review')->references(['id'])->on('reviews')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_review', function (Blueprint $table) {
            $table->dropForeign('fk_review_school');
            $table->dropForeign('fk_school_review');
        });
    }
};
