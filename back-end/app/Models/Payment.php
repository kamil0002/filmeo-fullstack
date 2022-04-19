<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

     protected $fillable = [
        'user_id',
        'rental_id',
        'amount'
    ];

    protected $table = 'payments';

    protected $primaryKey = 'id';

    public function user() {
        $this->belongsTo(User::class);
    }

    public function rental() {
        $this->belongsTo(Rental::class);
    }

}
