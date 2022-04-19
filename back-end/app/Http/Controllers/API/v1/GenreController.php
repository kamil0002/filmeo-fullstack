<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\API\v1\ErrorController;
use App\Models\Genre;


class GenreController extends Controller
{    
    /**
     * rules
     *
     * @return array walidacja dla gatunku filmu
     */
    private function rules() {
        return ['name' => 'required|string'];
    }

    
    /**
     * getAllGenres
     *
     * @param  mixed $request
     * @return json wszystkie gatunki filmów z bazy
     */
    public function getAllGenres(Request $request)
    {
        //* Get Filters
        $filters = explode(',',$request->fields ?? 'name');
        array_push($filters, 'id');

        $genres =  Genre::select($filters)->get();

        error_log($request->fields);
        error_log('name');

        if(!$genres) {
            return ErrorController::handleError('Nie znaleziono żadnych wyników', 404);
        }

        return response([
            'status' => 'success',
            'data' => [
                $genres
            ]
        ]);
    }

    
    /**
     * createGenre
     *
     * @param  mixed $request
     * @return json stworzony gatunek filmu
     */
    public function createGenre(Request $request)
    {

        $validator = Validator::make($request->all(), $this->rules());

        if($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }


        $genre = Genre::create($request->all());



        return response([
            'status' => 'success',
            'data' => [
                $genre
         ]
        ],201);

    }
    
    /**
     * getGenre
     *
     * @param  mixed $genreId id gatunku
     * @return json pojedyńczy gatunek
     */
    public function getGenre($genreId)
    {
        
        $genre = Genre::find($genreId);

        if(!$genre) {
            return ErrorController::handleError('Gatunek o podanym ID nie istnieje.', 404, 'failed');
        }

        return response([
            'status' => 'success',
            'data' => [
                $genre
            ]
        ]);
    }
}
