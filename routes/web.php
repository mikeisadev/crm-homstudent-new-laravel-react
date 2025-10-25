<?php

use Illuminate\Support\Facades\Route;

// All routes handled by React Router - catch-all route MUST be last
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
