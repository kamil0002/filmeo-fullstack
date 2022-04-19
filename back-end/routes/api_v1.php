<?php

use App\Http\Controllers\API\v1\AdminController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\v1\ChatController;
use App\Http\Controllers\API\v1\UserController;
use App\Http\Controllers\API\v1\AuthController;
use App\Http\Controllers\API\v1\BusinessController;
use App\Http\Controllers\API\v1\GenreController;
use App\Http\Controllers\API\v1\ImageController;
use App\Http\Controllers\API\v1\MovieController;
use App\Http\Controllers\API\v1\RentalController;
use App\Http\Controllers\API\v1\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::get('/users', [UserController::class, 'getAllUsers']);
Route::get('/users/{userId}', [UserController::class, 'getUser']);


//* Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//* Movie
Route::post('/movies/genre/{genre}', [MovieController::class, 'createMovie']);
Route::get('/movies', [MovieController::class, 'getMovies']);
Route::get('/movies/slug/{movieSlug}', [MovieController::class, 'getMovieBySlug']);
Route::get('/movies/{movieId}', [MovieController::class, 'getMovie']);
Route::put('/movies/{movieId}', [MovieController::class, 'updateMovie']); //* -

//* top 5
Route::get('/top-5-frequently-rented', [MovieController::class, 'frequentlyRented']);
Route::get('/top-5-rated', [MovieController::class, 'topRated']);
Route::get('/last-added-movies', [MovieController::class, 'lastAdded']);

Route::get('/movies', [MovieController::class, 'getMovies']);

//* Genre
Route::post('/genres', [GenreController::class, 'createGenre']); //* -
Route::get('/genres', [GenreController::class, 'getAllGenres']);
Route::get('/genres/{genreId}', [GenreController::class, 'getGenre']); //* -

//* Get Messages
Route::get('/getMessages', [ChatController::class, 'getMessages']);

//* Reviews
Route::get('/reviews{reviewId}', [ReviewController::class, 'getReview']);


//* Proteced routes
Route::middleware('auth:sanctum')->group(function () {
  Route::get('/isLoggedIn', [AuthController::class, 'isLoggedIn']);
  Route::get('/hasUserMovie/{movieId}', [RentalController::class, 'hasMovie']);


  Route::delete('/reviews/{reviewId}', [ReviewController::class, 'deleteReview']);

  //* User Authenticated func
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::put('/updateMyPassword', [AuthController::class, 'updateMyPassword']);
  Route::put('/updateMyProfile', [UserController::class, 'updateUserData']);

  //* Upload Photo
  Route::post('/uploadAvatar', [ImageController::class, 'uploadAvatar']);
  
  //* Messages
  Route::post('/message', [ChatController::class, 'sendMessage']);

  
  //* Only Admin func
  Route::middleware('restrictToAdmin')->group(function() {
    Route::delete('/admin/movies/{movieId}', [MovieController::class, 'deleteMovie']);
    Route::put('/admin/add-moderator', [AdminController::class, 'addModerator']);
    Route::put('/admin/delete-moderator', [AdminController::class, 'deleteModerator']);
    Route::put('/admin/ban', [AdminController::class, 'banUser']);
    Route::put('/admin/unban', [AdminController::class, 'unbanUser']);
  });

  //* Admin and Moderator func
  Route::middleware('restrictToModerator')->group(function() {
    Route::put('/admin/unmute', [AdminController::class, 'unmuteUser']);
    Route::put('/admin/mute', [AdminController::class, 'muteUser']);
  });

  //* Only User and Moderator func

  Route::middleware('userModeratorFunc')->group(function() {
    //* Movie video
    Route::get('/rentals/{rentalId}/movies/{movieSlug}/video', [MovieController::class, 'getMovieVideo']);

    //* Rentals
    Route::patch('/renewRental', [RentalController::class, 'renewRental']);

    //* Payments with Stripe and Rentals
    Route::get('/getSession/{movieId}/rental/{rentalId}', [RentalController::class, 'getCheckoutSession']);

    //* Get Rewnew Movie Session
    Route::get('/getSession/{movieId}/rental/{rentalId}', [RentalController::class, 'getCheckoutSession']);

    Route::post('/rentMovie', [RentalController::class, 'rentMovie']);
    Route::get('/rentals/myRentals', [RentalController::class, 'getUserMovies']);

    //* Review
    Route::get('/myReviews', [ReviewController::class, 'getMyReviews']);
    Route::post('/reviews/movie/{slug}', [ReviewController::class, 'createReview']);

    //* Business Logic
    Route::get('/myBaseStats', [BusinessController::class, 'getUserBaseStats']);
    Route::get('/myFavouriteGenres', [BusinessController::class, 'getFavouriteGenres']);
    Route::get('/last-7-days-rentals-number', [BusinessController::class, 'amountOfRecentRentals']);
    Route::get('/last-7-days-spendings', [BusinessController::class, 'lastSpendings']);
  });
});
