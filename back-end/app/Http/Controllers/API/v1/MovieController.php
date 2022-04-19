<?php

namespace App\Http\Controllers\API\v1;

use App\Models\Genre;
use Illuminate\Http\Request;
use App\Models\Movie;
use App\Models\Rental;
use App\Models\Review;
use Cviebrock\EloquentSluggable\Services\SlugService;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\API\v1\ErrorController;
use App\Models\User;

class MovieController extends Controller
{

    
    /**
     * createRules
     *
     * @return array walidacja dla tworzenia filmu
     */
    private function createRules()
    {
        return [
            'title' => 'bail|required|string|unique:movies',
            'age_limit' => 'required|numeric|min:1',
            'description' => 'required|string',
            'short_description' => 'required|string',
            'director' => 'required|string',
            'release_date' => 'required|date|before:today',
            'running_time' => 'required|numeric',
            'poster' => 'required|string',
            'movie_link' => 'required|string',
            'trailer_link' => 'required|string',
            'details_link' => 'required|string',
            'cost' => 'required|numeric',
            'genres' => 'required|array|min:1'
        ];
    }
    
    /**
     * updateRules
     *
     * @return array walidacja dla aktualizowania filmu
     */
    private function updateRules()
    {
        return [
            'title' => 'bail|string|unique:movies',
            'description' => 'string',
            'short_description' => 'string',
            'director' => 'string',
            'release_date' => 'date|before:today',
            'running_time' => 'numeric',
            'poster' => 'string',
            'movie_link' => 'string',
            'trailer_link' => 'string',
            'details_link' => 'string',
            'cost' => 'numeric',
            'genres' => 'array|min:1'
        ];
    }

    public function getMovieBySlug(string $movieSlug) {
        $movie = Movie::where('slug', '=', $movieSlug)->with('reviews')->with('genres')->get();

        if(!$movie) {
            return ErrorController::handleError('Film nie istnieje!', 404);
        } 

        $movie[0]['rating_average'] = floatval(floor($movie[0]->reviews->avg('rating')) . substr(str_replace(floor($movie[0]->reviews->avg('rating')), '', $movie[0]->reviews->avg('rating')), 0, 2 + 1)) ?? 0;

        foreach($movie[0]->reviews as $review) {
            $author = User::where('id' ,'=', $review->user_id)->select('name')->get();
            unset($review['user_id']);
            $review->author = $author[0]->name;
        }

        return response([
            'status' => 'success',
            'data' => [
                $movie
            ]
        ]);
    }

        
    /**
     * getMovies
     *
     * @param  mixed $request
     * @return json kolekcje wszystkich filmów pasujących do filtra
     */
    public function getMovies(Request $request)
    {

        define('filters', ['id', 'title', 'rating_quantity', 'short_description', 'poster', 'slug', 'release_date', 'running_time']);

        if($request->genres)
            $movies = Movie::whereHas('genres')->with('genres')->select(constant('filters'))->get();
        else $movies = Movie::select(constant('filters'))->get();
        
        //* If user use a query filter text
        if($request->search) {
            $filteredMovies = Movie::where('title', 'like', '%'.$request->search.'%')->select(constant('filters'))->get();

            $movies = $filteredMovies;
        }

        //* If user query for genres
        if($request->genre) {
            $filteredMovies = [];

            foreach($movies as $movie) {
                foreach($movie->genres as $movieGenre) {
                    if(strtolower($request->genre) === strtolower($movieGenre->name)) {
                        array_push($filteredMovies, $movie);
                        break;
                    }
                }
            }

            $movies = $filteredMovies;
        }


        if(count($movies) === 0) {
            return ErrorController::handleError('Nie znaleziono żadnych wyników', 404);
        }

        foreach($movies as $movie) {
            $reviews = Review::where('movie_id', '=', $movie->id)->select('rating')->get();

            $movie['rating_average'] = floatval(floor($reviews->avg('rating')) . substr(str_replace(floor($reviews->avg('rating')), '', $reviews->avg('rating')), 0, 2 + 1)) ?? 0;
        }

        return response([
            'status' => 'success',
            'results' => count($movies),
            'data' => [
                $movies
            ]
            ]);
    }

        
    /**
     * createMovie
     *
     * @param  mixed $request
     * @return json film
     */
    public function createMovie(Request $request)
    {

        $validator = Validator::make($request->all(), $this->createRules());

        if($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $request['slug'] = SlugService::createSlug(Movie::class, 'slug', $request->title);

        $genresIds = [];

        //Loop over all genres and find their ids
        foreach($request->genres as $movieGenre) {
            $genre = Genre::where('name','=',$movieGenre)->select('id')->get();
            array_push($genresIds, $genre[0]->id);
        }

        // Find Genres in Genres table
        $genres = Genre::find($genresIds);

        $movie = Movie::create($request->all());

        // Assign appropriate genres to movie
        $movie->genres()->attach($genres);
        

        return response([
            'status' => 'success',
            'data' => [
                $movie
            ]
            ], 201);
    }

        
    /**
     * getMovie
     *
     * @param  mixed $movieId id filmu
     * @return json film
     */
    public function getMovie(int $movieId)
    {
        //* Get Filters

        $movie = Movie::find($movieId);

        if(!$movie) {
            return ErrorController::handleError('Film o podanym ID nie istnieje.', 404);
        }

        $movie = $movie->where('id', '=', $movieId)->with('genres')->with('reviews')->first();

        $reviews = Review::where('movie_id', '=', $movieId)->select('rating')->get();

        $movie['rating_average'] = floatval(floor($reviews->avg('rating')) . substr(str_replace(floor($reviews->avg('rating')), '', $reviews->avg('rating')), 0, 2 + 1)) ?? 0;

        //* Check if user rented this movie already

        return response([
            'status' => 'success',
            'data' => [
                $movie
            ]
        ]);
    }


        
    /**
     * updateMovie
     *
     * @param  mixed $request
     * @param  mixed $movieId id filmu
     * @return json zaaktualizowany film
     */
    public function updateMovie(Request $request, int $movieId)
    {
        $movie = Movie::find($movieId);

        if(!$movie) {
            return ErrorController::handleError('Film o podanym ID nie istnieje', 404);
        }

        $validator = Validator::make($request->all(), $this->updateRules());
        
        if($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $request['title'] && $request['slug'] = SlugService::createSlug(Movie::class, 'slug', $request->title);

        $movie->update($request->all());

        return response([
            'status' => 'success',
            'data' => [
                $movie
                ]
            ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteMovie(int $movieId) {

        $movie = Movie::destroy($movieId);
        if(!$movie) {
            return ErrorController::handleError('Film o podanym ID nie istnieje', 404);
        }

        return response([
            'status' => 'success',
            'data' => [
                null
            ]
            ], 204);
    }

    public function getMovieVideo(int $rentalId, string $movieSlug) {
        //* Find actual rental
        $rental = Rental::find($rentalId);
        $rental = $rental::where('id', '=', $rentalId)->with('movies')->get()[0];

        if($movieSlug !== $rental->movies[0]->slug) {
            return ErrorController::handleError('Nie oszukuj...', 400, 'failed');
        }

        //* If Rental Expired inform a user and return
        if($rental->expire_date < date('Y-m-d H:i:s')) {
            return ErrorController::handleError('Niestety ten film nie jest już dostępny, odnów wypożyczenie aby znów oglądać!', 403, 'failed');
        }

        $movieVideo = Movie::where('slug', '=', $movieSlug)->select('movie_url')->get();

        return response([
            'status' => 'success',
            'data' => [
                $movieVideo
            ]
        ]);
    }

    //* Aggregations

    public function frequentlyRented() {

        $movies = Movie::orderBy('rentals_number', 'desc')->with('genres')->paginate(5);

        
        foreach($movies as $movie) {
            $reviews = Review::where('movie_id', '=', $movie['id'])->select('rating')->get();

            $movie['rating_average'] = floatval(floor($reviews->avg('rating')) . substr(str_replace(floor($reviews->avg('rating')), '', $reviews->avg('rating')), 0, 2 + 1)) ?? 0;
        }
        
        return response([
            'status' => 'success',
            'results' => count($movies),
            'data' => [
                $movies
            ]
        ]);
    }

    public function topRated() {

        $movies = Movie::with('genres')->get();

        if(!$movies) {
            return ErrorController::handleError('Brak wyników', 404, 'failed');
        }

        foreach($movies as $movie) {
            $reviews = Review::where('movie_id', '=', $movie['id'])->select('rating')->get();

            $movie['rating_average'] = floatval(floor($reviews->avg('rating')) . substr(str_replace(floor($reviews->avg('rating')), '', $reviews->avg('rating')), 0, 2 + 1)) ?? 0;
        }

        $movies = $movies->toArray();

        //* Sort Movie By Rating
        usort($movies, function($a, $b) {
            if ($a['rating_average'] == $b['rating_average']) {
                return 0;
            }
            return ($a['rating_average'] > $b['rating_average']) ? -1 : 1;
        });

        $movies = array_slice($movies,0,5, true);

        return response([
            'status' => 'success',
            'results' => count($movies),
            'data' => [
                $movies
            ]
            ]
        );
    }

    public function lastAdded() {
        $movies = Movie::orderBy('created_at', 'desc')->with('genres')->paginate(5);

        foreach($movies as $movie) {
            $reviews = Review::where('movie_id', '=', $movie['id'])->select('rating')->get();

            $movie['rating_average'] = floatval(floor($reviews->avg('rating')) . substr(str_replace(floor($reviews->avg('rating')), '', $reviews->avg('rating')), 0, 2 + 1)) ?? 0;
        }

        if(!$movies) {
            return ErrorController::handleError('Brak wyników', 404, 'failed');
        }
        
        return response([
            'status' => 'success',
            'results' => count($movies),
            'data' => [
                $movies
            ]
        ]);
    }

}
