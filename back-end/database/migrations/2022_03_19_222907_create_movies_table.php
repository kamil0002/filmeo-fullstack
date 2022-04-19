<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->integer('age_limit');
            $table->longText('description');
            $table->string('short_description');
            $table->string('director');
            $table->date('release_date');
            $table->integer('running_time');
            $table->string('poster');
            $table->string('movie_url');
            $table->string('trailer_url');
            $table->string('details_url');
            $table->integer('rentals_number')->default(0);
            $table->integer('rating_quantity')->default(0);
            $table->decimal('cost',5,2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('movies');
    }
};
