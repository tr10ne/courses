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
        Schema::table('review_school', function (Blueprint $table) {
            $table->foreign(['review_id'])->references(['id'])->on('reviews')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['school_id'])->references(['id'])->on('schools')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('review_school', function (Blueprint $table) {
            $table->dropForeign('review_school_review_id_foreign');
            $table->dropForeign('review_school_school_id_foreign');
        });
    }
};
