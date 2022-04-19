<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\Payment;
use App\Models\Rental;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use File;

class RentalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $json = File::get("database/dev-data/rentals-data.json");
        $rentals = json_decode($json);

        foreach($rentals as $key => $val) {

            $movie = Movie::find($val->movie_id);

            $rentalActive = false;

            $currentTime = time();

            //* Start Point Of The Date
            $start = strtotime(date('Y-m-d H:m:s', $currentTime - 1 * 168 * 60 * 60));

            //* End Point Point Of The Date
            $end = strtotime(date('Y-m-d H:m:s'));

            //* Custom Date Range.
            $timestamp = mt_rand($start, $end);

            //* Random Date
            $date = date("Y-m-d H:m:s", $timestamp);

            $twoDaysBehind = date('Y-m-d H:m:s', $currentTime - 1 * 48 * 60 * 60);

            $rentedTo = date('Y-m-d H:m:s', $timestamp + 1 * 48 * 60 * 60);

            if($rentedTo > $twoDaysBehind) {
                $rentalActive = true;
            }

        
            $rental = Rental::create([
                'user_id' => $val->user_id,
                'expire_date' => $rentedTo,
                'active' => $rentalActive,
                'created_at' => $date
            ]);

            Payment::create([
                'user_id' => $val->user_id,
                'rental_id' => $rental->id,
                'amount' => $movie->cost,
                'created_at' => $date
                // 'created_at' => $rentalActive ? date('Y-m-d H:i:s') : $date
            ]);

            $movie->update([
                'rentals_number' => $movie->rentals_number = $movie->rentals_number + 1
            ]);

            $rental->movies()->attach($movie);
        }
    }
}
