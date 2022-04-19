<?php

namespace App\Http\Controllers\API\v1;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\API\v1\ErrorController;


class ImageController extends Controller
{
    
    /**
     * rules
     *
     * @return array walidacja dla awataru
     */
    public function rules()
    {
        return [
            'avatar' => 'required|image|mimes:jpeg,png,jpg|max:800',
        ];
    }
    
    /**
     * uploadAvatar
     *
     * @param  mixed $request
     * @return json nowa ścieżka do avataru
     */
    public function uploadAvatar(Request $request) {

        $file = $request->hasFile('avatar');

        $validator = Validator::make($request->all(), $this->rules());

        if($validator->fails()) {
            return ErrorController::handleError('Niepoprawne zdjęcie, dostępne formaty to: jpeg,png,jpg, a maksymalny rozmiar to 800px.', 400, 'failed');
        }

        if(!$file) {
            return ErrorController::handleError('Niepoprawne zdjęcie', 400, 'failed');
        }


        if($file) {
            $avatar = $request->file('avatar');

            //* Create Random File Name
            $fileName = time().$avatar->getClientOriginalName();
    

            //* Save File To appropriate folder
            $avatar->move(public_path('images/avatars'), $fileName);

            //* Get User
            $user = auth()->user();

            //* Update User File Path
            $user->update([
                'avatar' => $fileName
            ]);

            return response([
                'status' => 'success',
                'data' => [
                    $fileName
                ]
            ]);
        }
    }
}
