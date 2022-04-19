<?php

namespace App\Http\Controllers\API\v1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\API\v1\ErrorController;


class UserController extends Controller
{

    
    /**
     * updateRules
     *
     * @return array walidacja dla aktualizacji danych użytkownika
     */
    private function updateRules() {
        return [
            'name' => 'string',
            'surname' => 'string',
            'address' => 'string',
            'birth_date' => 'date',
            'email' => 'email',
        ];
    }
    
    /**
     * getAllUsers
     *
     * @return json wszystkich użytkowników
     */
    public function getAllUsers(Request $request) {
        if($request->moderators) {
            $users = User::where('role', '=', 'moderator')->get();
        }
        else $users = User::all();

        return response([
            'status' => 'success',
            'data' => [
                $users
            ]
        ]);
    }
    
    /**
     * getUser
     *
     * @param  mixed $userId id użytkownika
     * @return json użytkownika o id $userId
     */
    public function getUser($userId) {
        $user = User::find($userId);

        if(!$user) {
            return ErrorController::handleError('Nie znaleziono podanego użytkownika', 404, 'failed');
        }

        return response([
            'status' => 'success',
            'data' => [
                $user
            ]
        ]);
    }
    
    /**
     * updateUserData
     *
     * @param  mixed $request
     * @return json zaaktualizowanego użytkownika
     */
    public function updateUserData(Request $request) {

    if($request['password'] || $request['password_confirmation']) {
        return ErrorController::handleError('Ten route nie służy do zmiany hasła!', 400);
    }

    $user = auth()->user();

    $validator = Validator::make($request->all(), $this->updateRules());

    if($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    
    $user->update($request->all());

    return response([
        'status' => 'succes',
        'data' => [
            $user
        ]
    ]);
    }
}
