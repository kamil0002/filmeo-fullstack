<?php

namespace App\Http\Controllers\API\v1;

use App\Models\Movie;
use App\Models\Rental;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\API\v1\ErrorController;


class ReviewController extends Controller
{
    
    /**
     * rules
     *
     * @return array walidacja dla recenzji filmu
     */
    private function rules() {
        return [
            'title' => 'required|string|min:3|max:35',
            'description' => 'required|string|min:15|max:100',
            'rating' => 'required|numeric|min:1|max:5',
        ];
    }
    
    /**
     * createReview
     *
     * @param  mixed $request
     * @param  mixed $movieId id filmu
     * @return json stworzoną opinię
     */
    public function createReview(Request $request, string $slug) {

        $movie = Movie::where('slug', '=', $slug)->get()[0];

        if(!$movie) {
            return ErrorController::handleError('Film do którego chcesz dodać opinię nie istnieje!', 400, 'failed');
        }
        
        $validator = Validator::make($request->all(), $this->rules());


        if($validator->fails()) {
            return response()->json([
                'message' => 'Tytuł powinen zawierać między 3 a 30 znaków a opis między 15 a 100 znaków']);
        }

        $userId = auth()->user()->id;

        //* Check if current movie is owned by a user
        $rentals = Rental::where('user_id', '=', $userId)->with('movies')->get();
        $reviewVerified = false;

        foreach($rentals as $rental) {
            foreach($rental->movies as $rentedMovie) {
                if($rentedMovie->id === $movie->id) {
                    $reviewVerified = true;
                    break 2;
                }
            }
        }

        $review = Review::create([
            'title' => $request['title'],
            'description' => $request['description'],
            'rating' => $request['rating'],
            'user_id' => $userId,
            'movie_id' => $movie->id,
            'verified' => $reviewVerified
        ]);


        $movie->update([
            'rating_quantity' => $movie->rating_quantity++
        ]);

        return response([
            'status' => 'success',
            'data' => [
                $review
            ]
        ],201);
    }

    
    /**
     * deleteReview
     *
     * @param  mixed $reviewId id recenzji
     * @return void
     */
    public function deleteReview(int $reviewId) {

        $user = auth()->user();

        $review = Review::where('id', '=', $reviewId)->get();

        if(count($review) === 0) {
            return ErrorController::handleError('Ta opinia nie istnieje.', 404);
        }

        $review = $review[0];

        //* Check if current review is the auth user review or if user isn't admin
        if($user->role !== 'administrator' && $user->role !== 'moderator') {
            if($review->user_id !== $user->id)
                return ErrorController::handleError('Możesz usuwać tylko własne opinie użytkowniku!', 403);
        }

        $movie = Movie::where('id', '=', $review->movie_id)->get()[0];

        $movie->update([
            'rating_quantitity' => $movie->rating_quantity--
        ]);


        $review = Review::destroy($reviewId);


        return response([
        'status' => 'success',
        'data' => [
            null
        ]
        ], 204);
    }
    
    /**
     * getMyReviews
     *
     * @return json recenzje użytkownika
     */
    public function getMyReviews() {

        $userId = auth()->user()->id;
        
        if(!$userId) {
            return ErrorController::handleError('Nie znaleziono użytkownika', 404, 'failed');
        }

        $reviews = Review::where('user_id', '=', $userId)->get();
        
        foreach($reviews as $review) {
            $movieTitle = Movie::where('id', '=', $review->movie_id)->select('title')->get()[0]->title;
            unset($review->movie_id);
            $review->movie_title = $movieTitle;
        }

        return response([
            'status' => 'success',
            'results' => count($reviews),
            'data' => [
                $reviews
            ]
        ]);
    }
}
