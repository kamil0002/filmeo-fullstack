<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

         protected $fillable = [
        'user_id',
        'active',
        'expire_date',
        'renewals_quantity',
        'cost',
    ];

    protected $table = 'rentals';

    protected $primaryKey = 'id';

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function movies() {
        return $this->belongsToMany(Movie::class);
    }

    
    public function payments() {
        return $this->hasMany(Payment::class);
    }
}
