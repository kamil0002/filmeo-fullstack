<?php

namespace App\Http\Controllers\API\v1;

use App\Events\Message as MessageEvent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\v1\ErrorController;
use DateTime;
use DateTimeZone;

class ChatController extends Controller
{
    
    /**
     * rules
     *
     * @return array walidacja dla wiadomości
     */
    private function rules() {
        return [
            'message' => 'required|string'
        ];
    }
    
        
    /**
     * sendMessage
     *
     * @param  mixed $request
     * @return void
     */
    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), $this->rules());

        if($validator->fails()) {
            return ErrorController::handleError('Treść wiadomości jest wymagana!', 400, 'failed');
        }

        $userId = auth()->user()->id;
        $userName = auth()->user()->name;
        $userAvatar = auth()->user()->avatar;
        if(auth()->user()->muted === 1) {
            return ErrorController::handleError('Przykro nam lecz zostałeś zmutowany!', 405);
        }

        Message::create([
            'user_id' => $userId,
            'message' => $request['message']
        ]);

        event(new MessageEvent($userName,$userId,$userAvatar, date_timezone_set(new DateTime(), new DateTimeZone('Europe/Warsaw')), $request['message']));

        return [];
    }

    
    /**
     * getMessages
     *
     * @return json wiadomości z ostatnich 12 godzin
     */
    public function getMessages() {
        $currentTime = time();

        $to = date('Y-m-d');
        $from = date('2022-03-22', $currentTime - 12 * 60 * 60);

        //* Get Messages From Last 12 hours
        $messages = Message::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)
        ->with('user')->get();

        return response([
            'status' => 'success',
            'data' => [
                $messages
            ]
        ]);
    }
}