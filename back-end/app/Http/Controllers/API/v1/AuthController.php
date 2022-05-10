<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

use App\Http\Controllers\API\v1\ErrorController;
use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    /**
     * registerRules
     *
     * @return array walidacja dla rejestracji
     */
    private function registerRules()
    {
        return [
            'name' => 'required|string',
            'surname' => 'required|string',
            'address' => 'required|string',
            'birth_date' => 'required|date',
            'role' => 'string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed'
        ];
    }

    /**
     * updatePasswordRules
     *
     * @return array walidacja dla aktualizacji hasła
     */
    private function updatePasswordRules()
    {
        return [
            'old_password' => 'required|string',
            'password' => 'required|string|confirmed'
        ];
    }


    /**
     * register
     *
     * @param  mixed $request
     * @return json użytkownik oraz token weryfikacyjny
     */
    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), $this->registerRules());

        if ($validator->fails()) {
            return ErrorController::handleError($validator->errors(), 400);
        }

        //* Check if user is banned



        $request['role'] = 'user';



        //* Create User
        $user = User::create([
            'name' => $request['name'],
            'surname' => $request['surname'],
            'address' => $request['address'],
            'birth_date' => $request['birth_date'],
            'role' => $request['role'],
            'email' => $request['email'],
            'password' => bcrypt($request['password']),
        ]);

        $token = $user->createToken('user_token')->plainTextToken;

        // TODO ENABLE EMAIL
        //* Send Welcome Mail To a User
        //Mail::to($request['email'])->send(new WelcomeMail($request['name']));

        return response([
            'status' => 'success',
            'token' => $token,
            'data' => [
                $user
            ]
        ], 201);
    }


    /**
     * login
     *
     * @param  mixed $request
     * @return json użytkownik oraz token weryfikacyjny
     */
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ], [
            'email.required' => 'Aby się zalogować podaj e-mail oraz hasło',
            'password.required' => 'Aby się zalogować podaj e-mail oraz hasło'
        ]);


        //* Check Email
        $user = User::where('email', $fields['email'])->first();

        //* Check Password
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return ErrorController::handleError('Niepoprawny e-mail lub hasło', 401);
        }
        if ($user?->banned) {
            return ErrorController::handleError('Przykro nam, lecz zostałeś zbanowany. W celu wyjaśnienia przyczyny skontaktuj się z ' . env('MAIL_FROM_ADDRESS') . '.', 401);
        }


        $token = $user->createToken('user_token')->plainTextToken;

        return response([
            'status' => 'success',
            'token' => $token,
            'data' => [
                $user
            ]
        ], 201);
    }

    public function isLoggedIn()
    {
        if (Auth::check()) {
            $user = auth()->user();
            return response($user);
        }

        return response([
            'message' => "Użytkownik nie jest zalogowany",
        ], 401);
    }

    /**
     * logout
     *
     * @return json wiadomość o akcji
     */
    public function logout()
    {

        auth()->user()->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pomyślnie wylogowano.'
        ], 200);
    }


    /**
     * updateMyPassword
     *
     * @param  mixed $request
     * @return json status akcji 
     */
    public function updateMyPassword(Request $request)
    {

        $user = auth()->user();

        //* Check if old password is correct
        if (!$user || !Hash::check($request['old_password'], $user->password)) {
            return ErrorController::handleError('Niepoprawne stare hasło.', 401);
        }


        $validator = Validator::make($request->all(), $this->updatePasswordRules());

        if ($validator->fails()) {
            return ErrorController::handleError('Hasła nie pasują do siebie!', 400);
        }

        $user->update([
            'password' => bcrypt($request['password']),
        ]);

        return response([
            'status' => 'success'
        ]);
    }
}
