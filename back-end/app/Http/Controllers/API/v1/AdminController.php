<?php

namespace App\Http\Controllers\API\v1;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\API\v1\ErrorController;
use Error;
use Monolog\ErrorHandler;

class AdminController extends Controller
{
    
    /**
     * addModerator
     *
     * @param  mixed $request
     * @return json wiadomość o akcji
     */
    public function addModerator(Request $request) {
        $user = User::where('email', '=', $request['email'])->get()[0];

        
        if(!$user) {
            return ErrorController::handleError('Nie znaleziono podanego użytkownika', 404, 'error');
        }

        $user->update([
            'role' => 'moderator'
        ]);

        return response([
            'status' => 'success',
            'message' => 'Użytkownik '.$user->name.' został moderatoem'
        ]);
    }

        public function deleteModerator(Request $request) {
        $user = User::find($request['userId']);

        if(!$user) {
            return ErrorController::handleError('Nie znaleziono podanego użytkownika', 404, 'error');
        }

        $user->update([
            'role' => 'user'
        ]);

        return response([
            'status' => 'success',
            'message' => 'Rola moderatora użytkownikowi '.$user->name.' została odebrana'
        ]);
    }

    
    /**
     * banUser
     *
     * @param  mixed $request
     * @return json wiadomość o akcji
     */
    public function banUser(Request $request) {

        $user = User::where('email', '=', $request['email'])->get()[0];

        $user->update([
            'banned' => true
        ]);

        return response([
            'status' => 'success',
            'message' => 'Użytkownik '.$user->name.' został zbanowany'
        ]);
    }

    public function muteUser(Request $request) {
        $user = User::find($request['userId']);

        if(!$user) {
            return ErrorController::handleError('Użytkownik nie istnieje!', 404);
        }

        if($user->role === 'moderator' || $user->role === 'administrator') {
            return ErrorController::handleError('Nie możesz mutować innych moderatorów i administratorów!', 500);
        }

        $user->update([
            'muted' => true
        ]);

        return response([
            'status' => 'success',
            'message' => 'Użytkownik '.$user->name.' został zmutowany'
        ]);
    }
    
    /**
     * unbanUser
     *
     * @param  mixed $request
     * @return json wiadomość o akcji
     */
    public function unbanUser(Request $request) {
        $user = User::find($request['userId']);

        $user->update([
            'banned' => false
        ]);

        return response([
            'status' => 'success',
            'message' => 'Użytkownik '.$user->name.' został odbanowany'
        ]);
    }

        public function unmuteUser(Request $request) {
        $user = User::find($request['userId']);

        $user->update([
            'muted' => false
        ]);

        return response([
            'status' => 'success',
            'message' => 'Użytkownik '.$user->name.' został odmutowany'
        ]);
    }
}
