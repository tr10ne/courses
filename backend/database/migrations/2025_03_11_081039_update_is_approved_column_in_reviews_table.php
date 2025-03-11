<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateIsApprovedColumnInReviewsTable extends Migration
{
    public function up()
    {
        // Изменяем столбец is_approved
        Schema::table('reviews', function (Blueprint $table) {
            $table->boolean('is_approved')->nullable()->default(null)->change();
        });
    }

    public function down()
    {
        // Откат изменений (если нужно)
        Schema::table('reviews', function (Blueprint $table) {
            $table->boolean('is_approved')->default(false)->change();
        });
    }
}