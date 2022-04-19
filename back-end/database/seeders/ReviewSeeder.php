<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\Rental;
use App\Models\Review;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use File;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {

        $json = File::get("database/dev-data/reviews-data.json");
        $reviews = json_decode($json);

         foreach($reviews as $key => $val) {

            $movie = Movie::find($val->movie_id);
  
            Review::create([
                'title' => $val->title,
                'description' => $val->description,
                'rating' => $val->rating,
                'user_id' => $val->user_id,
                'movie_id' => $val->movie_id,
                'verified' => false,
            ]);
    
    
            $movie->update([
                'rating_quantity' => $movie->rating_quantity = $movie->rating_quantity + 1
            ]);
        }
    }
}
