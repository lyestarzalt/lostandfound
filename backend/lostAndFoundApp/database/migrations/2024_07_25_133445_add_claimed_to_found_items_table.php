<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClaimedToFoundItemsTable extends Migration
{
    public function up()
    {
        Schema::table('found_items', function (Blueprint $table) {
            $table->boolean('is_claimed')->default(false);
        });
    }

    public function down()
    {
        Schema::table('found_items', function (Blueprint $table) {
            $table->dropColumn('is_claimed');
        });
    }
}
