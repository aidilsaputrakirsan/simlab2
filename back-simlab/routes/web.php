<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — SPA React (single-domain)
|--------------------------------------------------------------------------
| Semua rute non-/api menyajikan index.html hasil build React.
| Panggilan API tetap ditangani routes/api.php (prefix /api).
| File statis (assets, gambar) disajikan langsung oleh Apache.
*/

Route::get('/', function () {
    return response()->file(public_path('index.html'));
})->name('login');

Route::get('/{any}', function () {
    return response()->file(public_path('index.html'));
})->where('any', '^(?!api).*$');
