<?php

namespace App\Http\Controllers\API\v1;

use App\Models\Movie;
use App\Models\Payment;
use App\Models\Rental;

use App\Http\Controllers\API\v1\ErrorController;
use App\Models\Review;
use Illuminate\Http\Request;

class RentalController extends Controller
{    
    /**
     * getCheckoutSession
     *
     * @param  mixed $movieId id filmu
     * @return object sesja transakcji
     */
    public function getCheckoutSession(int $movieId, int $rentalId) {

        $movie = Movie::find($movieId);

        if($rentalId !== -1) {
            $successURL = 'http://localhost:3000/profil?movie='.$movie->id.'&rental='.$rentalId;
        }
        else {
           $successURL = 'http://localhost:3000/filmy?movie='.$movie->id;
        }

        $stripe = new \Stripe\StripeClient(env('STRIPE_API_KEY'));

        $session = $stripe->checkout->sessions->create([
        'payment_method_types' => ['card'],
        'mode' => 'payment',
        'success_url' => $successURL,
        'cancel_url' => 'http://localhost:3000/filmy/'.$movie->slug.'payment_failed',
        'customer_email' => auth()->user()->email,
        'line_items' => [[
            # Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
            'price_data' => [
                'currency' => 'pln',
                'unit_amount' => $movie->cost * 100,
                'product_data' => [
                    'name' => $movie->title,
                    'images' => ['https://thumbs.dreamstime.com/b/retro-cinema-video-camera-text-place-movie-poster-placard-banner-film-vector-illustration-flat-style-98856046.jpg'],
                    'description' => $movie->short_description,
                ],
            ],
            'quantity' => 1
        ]],
        ]);


        return $session;
    }
    
    /**
     * rentMovie
     *
     * @param  mixed $movieId id filmu
     * @return json wiadomość z komunikatem
     */
    public function rentMovie(Request $request) {
        $movie = Movie::where('id','=',$request['movieId'])->get()[0];
        error_log($movie);

        $userId = auth()->user()->id;

        //* Check if current movie is owned by a user
        $rentals = Rental::where('user_id', '=', $userId)->with('movies')->get();

        foreach($rentals as $rental) {
            foreach($rental->movies as $rentedMovie) {
                if($rentedMovie->id === $movie->id) {
                    error_log($rentedMovie->id.' -> '.$movie->id);
                    return ErrorController::handleError('Ten film jest już przez Ciebie wypożyczony!', 400, 'failed');

                }
            }
        }

        
        $rentedTo = date('Y-m-d H:i:s', strtotime('+48 hours'));
        
        $rental = Rental::create([
            'user_id' => $userId,
            'expire_date' => $rentedTo,
            'active' => true
        ]);

        Payment::create([
                'user_id' => $userId,
                'rental_id' => $rental->id,
                'amount' => $movie->cost,
            ]);

        $rental->movies()->attach($movie);

        return response([
            'status' => 'success',
            'message' => 'Film został wypożyczony. Miłego oglądania!' ,
        ],201);
    }

    
    /**
     * renewRental
     *
     * @param  mixed $rentalId id wypożyczenia
     * @param  mixed $movieId id filmu
     * @return json wiadomość z komunikatem
     */
    public function renewRental(Request $request) {

        $rentalId = $request['rentalId'];
        $movieId = $request['movieId'];

        $userId = auth()->user()->id;

        $rental = Rental::where('id', '=', $rentalId)->get()[0];

        $movieCost = Movie::find($movieId)->cost;
        
        if(!$rental) {
            return ErrorController::handleError('Ten film nie został przez Ciebie wcześniej wypożyczony', 400, 'failed');
        }


        if($userId !== $rental->user_id) {
            return ErrorController::handleError('Ten film nie należy do Ciebie!', 400);
        }

        if($rental->active) {
            return ErrorController::handleError('Aktualnie posiadasz już ten film w swojej kolekcji, odnów go po czasie wygaśnięcia.', 400, 'failed');

        }

        $rentedTo = date('Y-m-d H:i:s', strtotime('+48 hours'));
        
        if(!$rental->active) {
            $rental->update([
                'active' => true,
                'expire_date' => $rentedTo,
                'renewals_quantity' => $rental->renewals_quantity = $rental->renewals_quantity + 1
            ]);

            Payment::create([
                'user_id' => $userId,
                'rental_id' => $rental->id,
                'amount' => $movieCost,
            ]);
        }

        return [
            'status' => 'success',
            'message' => 'Status wypożyczenia został odnowiony. Odśwież stronę aby zaaktualizować bibliotekę. Miłego oglądania!'
        ];
    }

    
    /**
     * getUserMovies
     *
     * @return json ilość wyników, filmy użytkownika
     */
    public function getUserMovies() {

        $movies = Movie::whereHas('rentals')->with('rentals')->get();
        $userMovies = [];

        $userId = auth()->user()->id;

        $today = date('Y-m-d H:m:s');

        foreach($movies as $movie) {
            foreach($movie->rentals as $rental) {

                if($rental->user_id === $userId) {;
                    //* If rental expired make active status as false
                    error_log($rental->expire_date < $today);
                    if($rental->expire_date < $today) {
                        error_log($rental);
                        $rental->update([
                            'active' => false
                        ]);
                    }    

                    $movie = Movie::find($movie->id);
                    $reviews = Review::where('movie_id', '=', $movie->id)->select('rating')->get();

                    $movie->expire_date = $rental->expire_date;

                    $movie['rating_average'] = floatval(floor($reviews->avg('rating')) . substr(str_replace(floor($reviews->avg('rating')), '', $reviews->avg('rating')), 0, 2 + 1)) ?? 0;

                    //* Add bonus field if movie is not active or not
                    $movie['active'] = $rental->active;
                    $movie['rental_id'] = $rental->id;
                    array_push($userMovies, $movie);
                    break;
                }
            }
        }
        
        return [
            'status' => 'success',
            'results' => count($userMovies),
            'data' => [
                $userMovies
            ]
        ];
    }

    public function hasMovie(int $movieId) {
        $hasUserMovie = false;
        $userId = auth()->user()->id;
        $rentals = Rental::where('user_id', '=', $userId)->with('movies')->get();

        
        foreach($rentals as $rental) {
            if($rental->movies[0]->id === $movieId) {
                $hasUserMovie = true;
                break;
            }
        }

        return response([
            'owned' => $hasUserMovie
        ]);
        
    }
}