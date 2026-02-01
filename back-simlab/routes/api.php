<?php

use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\LaboratoryEquipmentController;
use App\Http\Controllers\Api\LaboratoryMaterialController;
use App\Http\Controllers\Api\LaboratoryRoomController;
use App\Http\Controllers\Api\MajorController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PracticumController;
use App\Http\Controllers\Api\PracticumModuleController;
use App\Http\Controllers\Api\PracticumSchedulingController;
use App\Http\Controllers\Api\PublicationCategoryController;
use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\StudyProgramController;
use App\Http\Controllers\Api\TestingCategoryController;
use App\Http\Controllers\Api\TestingRequestController;
use App\Http\Controllers\Api\TestingTypeController;
use App\Http\Controllers\Api\UserController;
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

Route::controller(AuthController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::get('/user/me', 'getCurrentUser');
});

// Universal Api
Route::get('/study-programs/select', [StudyProgramController::class, 'getDataForSelect']);
Route::get('/institutions/select', [InstitutionController::class, 'getDataForSelect']);
Route::get('publications/content/{slug}', [PublicationController::class, 'getBySlug']);
Route::resource('publications', PublicationController::class)->only(['index']);
Route::resource('laboratory-equipments', LaboratoryEquipmentController::class)->only(['index']);
Route::resource('laboratory-materials', LaboratoryMaterialController::class)->only(['index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::resource('laboratory-rooms', LaboratoryRoomController::class)->only(['index']);
    Route::get('/laboratory-rooms/{id}/schedules', [LaboratoryRoomController::class, 'getScheduledSessions']);
    Route::get('/dashboard/weekly-schedule', [LaboratoryRoomController::class, 'getWeeklyScheduleDashboard']);
    Route::get('/dashboard/admin-pengujian', [DashboardController::class, 'adminPengujian'])->middleware('role:admin_pengujian');
    Route::resource('practicums', PracticumController::class)->only(['index']);

    // Spesific select API
    Route::get('/practicums/select', [PracticumController::class, 'getDataForSelect']);
    Route::get('/laboratory-rooms/select', [LaboratoryRoomController::class, 'getDataForSelect']);
    Route::get('/users/select', [UserController::class, 'getDataForSelect']);
    Route::get('/testing-types/select', [TestingTypeController::class, 'getDataForSelect']);

    Route::group(['prefix' => 'payments', 'as' => 'payments'], function () {
        Route::middleware(['role:admin_pengujian'])->group(function () {
            Route::get('/', [PaymentController::class, 'index']);
            Route::get('/generate-number', [PaymentController::class, 'generatePaymentNumber']);
            Route::put('/{id}/create-payment', [PaymentController::class, 'createPayment']);
            Route::put('/{id}/verif', [PaymentController::class, 'verif']);
        });

        Route::put('/{id}/store-proof', [PaymentController::class, 'storePaymentProof']);
        Route::get('/{id}', [PaymentController::class, 'getPaymentData']);
    });

    // Admin only API
    Route::middleware(['role:admin'])->group(function () {
        // Academic Year Route
        Route::put('/academic-years/{id}/toggle-status', [AcademicYearController::class, 'toggleStatus']);
        Route::resource('academic-years', AcademicYearController::class);

        // Institution Route
        Route::resource('institutions', InstitutionController::class)->except(['show']);

        // PublicationCategory
        Route::get('/publication-categories/select', [PublicationCategoryController::class, 'getDataForSelect']);
        Route::resource('publication-categories', PublicationCategoryController::class)->except(['show']);

        // Publication Route
        Route::resource('publications', PublicationController::class)->except(['index']);

        // Faculty Route
        Route::get('/faculties/select', [FacultyController::class, 'getDataForSelect']);
        Route::resource('faculties', FacultyController::class);

        // Major Route
        Route::get('/majors/select', [MajorController::class, 'getDataForSelect']);
        Route::resource('majors', MajorController::class);

        // Testing Type Route
        Route::resource('testing-types', TestingTypeController::class);

        // Study Program Route
        Route::resource('study-programs', StudyProgramController::class);

        // Practicum
        Route::resource('practicums', PracticumController::class)->except(['index']);

        // Practicum Module
        Route::put('/practicum-modules/{id}/toggle-status', [PracticumModuleController::class, 'toggleStatus']);
        Route::resource('practicum-modules', PracticumModuleController::class);

        // User: admin, kepala_lab_terpadu, Koorpro, Kepala Lab Unit, laboran, Dosen, Mahasiswa, External
        Route::put('/users/{user}/restore-dosen', [UserController::class, 'restoreToDosen']);
        Route::put('/users/{user}/toggle-manager', [UserController::class, 'toggleManager']);
        Route::resource('users', UserController::class);

        Route::get('/testing-categories/select', [TestingCategoryController::class, 'getDataForSelect']);
        Route::resource('testing-categories', TestingCategoryController::class);
    });

    Route::middleware(['role:admin|laboran'])->group(function () {
        Route::resource('laboratory-rooms', LaboratoryRoomController::class)->except(['index']);
        Route::resource('laboratory-equipments', LaboratoryEquipmentController::class)->except(['index']);
        Route::resource('laboratory-materials', LaboratoryMaterialController::class)->except(['index']);
    });

    Route::group(['prefix' => 'testing-requests', 'as' => 'testing-requests', 'middleware' => 'role:kepala_lab_terpadu|laboran|dosen|mahasiswa|pihak_luar|admin_pengujian|kepala_lab_jurusan'], function () {
        Route::get('/{id}/detail', [TestingRequestController::class, 'getTestingRequestData']);
        Route::get('/{id}/approvals', [TestingRequestController::class, 'getTestingRequestApproval']);
        Route::group(['middleware' => 'role:mahasiswa|dosen|pihak_luar|koorprodi|kepala_lab_jurusan'], function () {
            Route::get('/', [TestingRequestController::class, 'index']);
            Route::post('/', [TestingRequestController::class, 'store']);
            // Route::get('/have-draft', [BookingController::class, 'isStillHaveDraftBooking']);
            // Route::post('/{id}/equipment-material', [BookingController::class, 'storeBookingEquipmentMaterial']);
            // Route::post('/{id}/equipment', [BookingController::class, 'storeBookingEquipment']);
        });

        Route::group(['middleware' => 'role:laboran|kepala_lab_terpadu|admin_pengujian'], function () {
            Route::get('/verification', [TestingRequestController::class, 'getTestingRequestForVerification']);
            Route::post('/{id}/verify', [TestingRequestController::class, 'verify']);
        });

        Route::group(['middleware' => 'role:laboran'], function () {
            Route::post('/{id}/upload-report', [TestingRequestController::class, 'uploadReport']);
        });
    });

    // booking (peminjaman)
    Route::group(['prefix' => 'bookings', 'as' => 'bookings', 'middleware' => 'role:admin|kepala_lab_terpadu|laboran|dosen|mahasiswa|pihak_luar|kepala_lab_jurusan|admin_pengujian'], function () {
        Route::get('/{id}/detail', [BookingController::class, 'getBookingData']);
        Route::get('/{id}/approvals', [BookingController::class, 'getBookingApprovals']);

        Route::group(['middleware' => 'role:mahasiswa|dosen|pihak_luar|admin|kepala_lab_jurusan'], function () {
            Route::get('/', [BookingController::class, 'index']);
            Route::post('/', [BookingController::class, 'store']);
            Route::get('/have-draft', [BookingController::class, 'isStillHaveDraftBooking']);
            Route::post('/{id}/equipment-material', [BookingController::class, 'storeBookingEquipmentMaterial']);
            Route::post('/{id}/equipment', [BookingController::class, 'storeBookingEquipment']);
        });

        Route::group(['middleware' => 'role:laboran|kepala_lab_terpadu|admin|admin_pengujian'], function () {
            Route::get('/verification', [BookingController::class, 'getBookingsForVerification']);
            Route::post('/{id}/verify', [BookingController::class, 'verify']);
            // Route::get('/export', [BookingController::class, 'bookingExport']);
        });

        Route::group(['middleware' => 'role:laboran'], function () {
            Route::post('/{id}/verify-return', [BookingController::class, 'bookingReturnVerification']);
        });

        Route::group(['middleware' => 'role:dosen|mahasiswa|pihak_luar|kepala_lab_jurusan'], function () {
            Route::post('/{id}/confirm-return', [BookingController::class, 'bookingReturnConfirmation']);
        });
    });

    // Practical Schedule
    Route::group(['prefix' => 'practicum-schedule', 'as' => 'practicum', 'middleware' => 'role:dosen|kepala_lab_jurusan|laboran|kepala_lab_terpadu'], function () {
        Route::get('/{id}/detail', [PracticumSchedulingController::class, 'getPracticumSchedulingData']);
        Route::get('/{id}/approvals', [PracticumSchedulingController::class, 'getPracticumSchedulingApproval']);

        // route based on role: laboran
        Route::group(['middleware' => 'role:dosen'], function () {
            Route::get('/my-classes', [PracticumSchedulingController::class, 'getPracticumSchedulingByLecturer']);
            Route::post('/{id}/set-lecturer-note', [PracticumSchedulingController::class, 'setLecturerNote']);
        });

        // route based on role: laboran
        Route::group(['middleware' => 'role:laboran'], function () {
            Route::post('/{id}/set-session-conducted', [PracticumSchedulingController::class, 'setSessionConducted']);
        });

        // route based on role: kepala_lab_jurusan
        Route::group(['middleware' => 'role:kepala_lab_jurusan'], function () {
            Route::get('/', [PracticumSchedulingController::class, 'index']);
            Route::post('/', [PracticumSchedulingController::class, 'store']);
            Route::put('/{id}', [PracticumSchedulingController::class, 'update']);
            Route::post('/{id}/equipment-material', [PracticumSchedulingController::class, 'storePracticumEquipmentMaterial']);
            Route::get('/have-draft', [PracticumSchedulingController::class, 'isStillHaveDraftPracticum']);
        });

        // route based on role: laboran & kepala_lab_jurusan
        Route::group(['middleware' => 'role:kepala_lab_terpadu|laboran'], function () {
            Route::get('/verification', [PracticumSchedulingController::class, 'getPracticumSchedulingForVerification']);
            Route::post('/{id}/verify', [PracticumSchedulingController::class, 'verifyPracticumScheduling']);
        });
    });

    // logout route
    Route::post('/logout', [AuthController::class, 'logout']);
});
