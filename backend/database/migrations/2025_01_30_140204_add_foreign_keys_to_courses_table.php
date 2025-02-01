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
        Schema::table('courses', function (Blueprint $table) {
            $table->foreign(['school_id'])->references(['id'])->on('schools')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['subcategory_id'])->references(['id'])->on('subcategories')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign('courses_school_id_foreign');
            $table->dropForeign('courses_subcategory_id_foreign');
        });
    }
};
