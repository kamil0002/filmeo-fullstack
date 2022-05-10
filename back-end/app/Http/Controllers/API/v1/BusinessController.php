<?php

namespace App\Http\Controllers\API\v1;

use App\Models\Payment;
use App\Models\Rental;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BusinessController extends Controller
{
    public function getUserBaseStats()
    {
        $user = auth()->user();
        $spentMoney = Payment::where('user_id', '=', $user->id)->select('amount')->sum('amount');
        $totalBorrowed = Rental::where('user_id', '=', $user->id)->count();

        return response([
            'status' => 'success',
            'data' => [
                'payments' => $spentMoney,
                'totalBorrowed' => $totalBorrowed
            ]

        ]);
    }

    public function getFavouriteGenres()
    {
        $userId = auth()->user()->id;

        $data = Db::select(Db::raw(
            'select g.name, count(*) as results
        from genres g, movies m, rentals r, movie_rental mr, genre_movie gm
        where (r.user_id = :userId)
        and (mr.rental_id = r.id)
        and (mr.movie_id = m.id)
        and (gm.genre_id = g.id)
        and (gm.movie_id = mr.movie_id)
        group by (g.name)
        order by count(*) desc'
        ), array('userId' => $userId));

        return response([
            'data' => $data
        ]);
    }

    public function amountOfRecentRentals()
    {
        $userId = auth()->user()->id;

        $recentRentals = Rental::where('user_id', '=', $userId)
            ->where('created_at', '>=', now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->select(
                DB::raw('count(rentals.user_id) as rentals'),
                DB::raw('day(created_at) Day'),
                'created_at'
            )
            ->groupBy('Day')
            ->take(7)
            ->get()
            ->groupBy(function ($date) {
                // group data by day
                return Carbon::parse($date->created_at)->format('d');
            });

        return response([
            'status' => 'success',
            'data' => [
                $recentRentals
            ]
        ]);
    }

    public function lastSpendings()
    {

        $userId = auth()->user()->id;

        $recentExpenses = Payment::where('user_id', '=', $userId)
            ->where('created_at', '>=', now()->subDays(7))
            ->select(
                'created_at',
                'amount',
                DB::raw('sum(payments.amount) as spendings'),
                DB::raw('day(created_at) Day')
            )
            ->orderBy('created_at', 'desc')
            ->groupBy('Day')
            ->take(7)
            ->get()
            ->groupBy(function ($date) {
                // group data by day
                return Carbon::parse($date->created_at)->format('d');
            });

        return response([
            'status' => 'success',
            'data' => [
                $recentExpenses
            ]
        ]);
    }
}
