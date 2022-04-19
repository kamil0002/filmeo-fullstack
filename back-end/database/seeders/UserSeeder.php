<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use File;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // User::factory()->count(10)->create();

        $json = File::get("database/dev-data/users-data.json");
        $users = json_decode($json);
        
        
        foreach($users as $key => $val) {
            User::create([
                'name' => $val->name,
                'surname' => $val->surname,
                'address' => $val->address,
                'birth_date' => $val->birth_date,
                'email' => $val->email,
                'password' => bcrypt($val->password),
                'role' => $val->role
            ]);
        }
    }
}
