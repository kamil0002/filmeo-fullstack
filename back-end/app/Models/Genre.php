<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    use HasFactory;

        protected $fillable = [
        'name',
    ];

    protected $attributes = [
        'created_at' => '2022-03-21T20:50:17.000000Z',
        'updated_at' => '2022-03-21T20:50:17.000000Z'
    ];

    public function movies() {
        return $this->belongsToMany(Movie::class);
    }
}
