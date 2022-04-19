<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

use File;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $json = File::get("database/dev-data/genres-data.json");
        $genres = json_decode($json);
        
        
        foreach($genres as $key => $val) {
            Genre::create([
                'name' => $val->name
            ]);
        }
    }
}
