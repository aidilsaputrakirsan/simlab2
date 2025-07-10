<?php

use App\Http\Controllers\Api\AlatLaboratoriumController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BahanLaboratoriumController;
use App\Http\Controllers\Api\JenisPengujianController;
use App\Http\Controllers\Api\JurusanController;
use App\Http\Controllers\Api\PraktikumController;
use App\Http\Controllers\Api\ProdiController;
use App\Http\Controllers\Api\RuanganLaboratoriumController;
use App\Http\Controllers\Api\TahunAkademikController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(AuthController::class)->group(function (){
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::get('/user/me', 'getCurrentUser');
});

// Universal Api
Route::prefix('pub')->group(function () {
    Route::get('/study-program', [ProdiController::class, 'getPublicStudyProgramData']);
});

Route::middleware('auth:sanctum')->group( function () {

    Route::post('/academic-year/validate/{id?}', [TahunAkademikController::class, 'validateAcademicYear']);
    Route::post('/testing-type/validate/{id?}', [JenisPengujianController::class, 'validateTestingType']);
    Route::post('/major/validate/{id?}', [JurusanController::class, 'validateMajor']);
    Route::post('/study-program/validate/{id?}', [ProdiController::class, 'validateStudyProgram']);
    Route::post('/practical-work/validate/{id?}', [PraktikumController::class, 'validatePracticalWork']);
    Route::post('/user/validate/{id?}', [UserController::class, 'validateUser']);
    Route::post('/laboratory-room/validate/{id?}', [RuanganLaboratoriumController::class, 'validateLaboratoryRoom']);
    Route::post('/laboratory-equipment/validate/{id?}', [AlatLaboratoriumController::class, 'validateLaboratoryEquipment']);
    Route::post('/laboratory-material/validate/{id?}', [BahanLaboratoriumController::class, 'validateLaboratoryMaterial']);

    Route::put('/academic-year/{id}/toggle-status', [TahunAkademikController::class, 'toggleStatus']);
    Route::resource('academic-year', TahunAkademikController::class);
    Route::resource('major', JurusanController::class);
    Route::resource('testing-type', JenisPengujianController::class);
    Route::resource('study-program', ProdiController::class);
    Route::resource('practical-work', PraktikumController::class);
    Route::resource('laboratory-room', RuanganLaboratoriumController::class);
    ROute::resource('laboratory-equipment', AlatLaboratoriumController::class);
    ROute::resource('laboratory-material', BahanLaboratoriumController::class);

    // User: Admin, Kepala Lab Terpadu, Koorpro, Kepala Lab Unit, Laboran, Dosen, Mahasiswa, External
    Route::put('/user/{user}/restore-dosen', [UserController::class, 'restoreToDosen']);
    Route::resource('user', UserController::class);



    // logout route
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
