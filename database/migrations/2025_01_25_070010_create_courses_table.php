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
        Schema::create('courses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('subcategory_id')->index('courses_subcategory_id_foreign');
            $table->unsignedBigInteger('school_id')->index('courses_school_id_foreign');
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10);
            $table->string('link');
            $table->string('link-more');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
