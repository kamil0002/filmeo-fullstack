<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'surname',
        'avatar',
        'role',
        'banned',
        'muted',
        'address',
        'birth_date',
        'email',
        'password',
    ];

    protected $attributes = [
        'role' => 'user',
        'muted' => false,
        'banned' => false,
        'avatar' => 'default.jpg'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function messages() {
        return $this->hasMany(Message::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function rentals() {
        return $this->hasMany(Rental::class);
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }
}
