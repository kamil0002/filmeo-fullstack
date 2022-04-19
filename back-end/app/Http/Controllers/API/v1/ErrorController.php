<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Support\Facades\Response;

class ErrorController extends Controller
{
    public static function handleError(string $errorMsg, int $statusCode, string $status = 'error') {
        return response([
                'status' => $status,
                'statusCode' => $statusCode,
                'message' => $errorMsg
            ]);
    }
}
