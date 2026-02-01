<?php

namespace App\Http\Controllers\Api;

use App\Models\Payment;
use App\Models\TestingCategory;
use App\Models\TestingRequest;
use App\Models\TestingRequestItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends BaseController
{
    /**
     * Dashboard untuk Admin Pengujian
     */
    public function adminPengujian(Request $request)
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // 1. Statistik Cards
        $stats = $this->getAdminPengujianStats($startOfMonth, $endOfMonth);

        // 2. Tren Pengajuan 6 bulan terakhir
        $requestTrend = $this->getRequestTrend(6);

        // 3. Pendapatan bulanan 6 bulan terakhir
        $revenueTrend = $this->getRevenueTrend(6);

        // 4. Jenis pengujian terpopuler (Top 10)
        $popularTestingTypes = $this->getPopularTestingTypes(10);

        // 5. Distribusi per kategori
        $categoryDistribution = $this->getCategoryDistribution();

        // 6. Distribusi status pengajuan
        $statusDistribution = $this->getStatusDistribution();

        // 7. Pengajuan terbaru (5 terakhir)
        $recentRequests = $this->getRecentRequests(5);

        // 8. Pengajuan menunggu verifikasi
        $pendingVerification = $this->getPendingVerificationRequests(5);

        // 9. Pembayaran pending verifikasi
        $pendingPayments = $this->getPendingPayments(5);

        return $this->sendResponse([
            'stats' => $stats,
            'request_trend' => $requestTrend,
            'revenue_trend' => $revenueTrend,
            'popular_testing_types' => $popularTestingTypes,
            'category_distribution' => $categoryDistribution,
            'status_distribution' => $statusDistribution,
            'recent_requests' => $recentRequests,
            'pending_verification' => $pendingVerification,
            'pending_payments' => $pendingPayments,
        ], 'Dashboard data retrieved successfully');
    }

    private function getAdminPengujianStats($startOfMonth, $endOfMonth)
    {
        // Pengajuan menunggu verifikasi (berbayar saja - untuk admin pengujian)
        $pendingVerification = TestingRequest::whereHas('testRequestItems', function ($q) {
            $q->where('price', '>', 0);
        })
            ->whereDoesntHave('testRequestApprovals', function ($q) {
                $q->where('action', 'verified_by_head');
            })
            ->whereHas('testRequestApprovals', function ($q) {
                $q->where('action', 'request_testing')->where('is_approved', true);
            })
            ->count();

        // Total pengajuan bulan ini
        $totalRequestsThisMonth = TestingRequest::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();

        // Total pendapatan bulan ini (dari payment yang sudah verified)
        $totalRevenueThisMonth = Payment::where('payable_type', TestingRequest::class)
            ->whereIn('status', ['paid', 'verified', 'approved'])
            ->whereBetween('updated_at', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        // Pembayaran perlu verifikasi
        $pendingPaymentVerification = Payment::where('payable_type', TestingRequest::class)
            ->whereNotNull('payment_proof')
            ->whereNotIn('status', ['paid', 'verified', 'approved'])
            ->count();

        return [
            'pending_verification' => $pendingVerification,
            'total_requests_this_month' => $totalRequestsThisMonth,
            'total_revenue_this_month' => $totalRevenueThisMonth,
            'pending_payment_verification' => $pendingPaymentVerification,
        ];
    }

    private function getRequestTrend($months)
    {
        $data = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();

            $count = TestingRequest::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();

            $data[] = [
                'month' => $date->format('M Y'),
                'month_short' => $date->format('M'),
                'count' => $count,
            ];
        }
        return $data;
    }

    private function getRevenueTrend($months)
    {
        $data = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();

            $amount = Payment::where('payable_type', TestingRequest::class)
                ->whereIn('status', ['paid', 'verified', 'approved'])
                ->whereBetween('updated_at', [$startOfMonth, $endOfMonth])
                ->sum('amount');

            $data[] = [
                'month' => $date->format('M Y'),
                'month_short' => $date->format('M'),
                'amount' => (int) $amount,
            ];
        }
        return $data;
    }

    private function getPopularTestingTypes($limit)
    {
        return TestingRequestItem::select('testing_type_id', DB::raw('COUNT(*) as total_requests'), DB::raw('SUM(quantity) as total_quantity'))
            ->with('testingType:id,name')
            ->groupBy('testing_type_id')
            ->orderByDesc('total_requests')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->testing_type_id,
                    'name' => $item->testingType?->name ?? 'Unknown',
                    'total_requests' => $item->total_requests,
                    'total_quantity' => $item->total_quantity,
                ];
            });
    }

    private function getCategoryDistribution()
    {
        return TestingCategory::withCount(['testingTypes as total_requests' => function ($query) {
            $query->select(DB::raw('COUNT(*)'))
                ->join('testing_request_items', 'testing_types.id', '=', 'testing_request_items.testing_type_id');
        }])
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'total_requests' => $category->total_requests ?? 0,
                ];
            });
    }

    private function getStatusDistribution()
    {
        $statuses = TestingRequest::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        // Map status labels
        $statusLabels = [
            'draft' => 'Draft',
            'pending' => 'Menunggu',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
        ];

        $result = [];
        foreach ($statusLabels as $key => $label) {
            $result[] = [
                'status' => $key,
                'label' => $label,
                'count' => $statuses[$key] ?? 0,
            ];
        }

        return $result;
    }

    private function getRecentRequests($limit)
    {
        return TestingRequest::with(['requestor:id,name', 'testRequestItems.testingType:id,name'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'activity_name' => $request->activity_name,
                    'requestor' => $request->requestor?->name,
                    'status' => $request->status,
                    'testing_time' => $request->testing_time?->format('d M Y H:i'),
                    'created_at' => $request->created_at->format('d M Y'),
                    'items_count' => $request->testRequestItems->count(),
                ];
            });
    }

    private function getPendingVerificationRequests($limit)
    {
        return TestingRequest::with(['requestor:id,name'])
            ->whereHas('testRequestItems', function ($q) {
                $q->where('price', '>', 0);
            })
            ->whereDoesntHave('testRequestApprovals', function ($q) {
                $q->where('action', 'verified_by_head');
            })
            ->whereHas('testRequestApprovals', function ($q) {
                $q->where('action', 'request_testing')->where('is_approved', true);
            })
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'activity_name' => $request->activity_name,
                    'requestor' => $request->requestor?->name,
                    'testing_time' => $request->testing_time?->format('d M Y H:i'),
                    'created_at' => $request->created_at->format('d M Y'),
                ];
            });
    }

    private function getPendingPayments($limit)
    {
        return Payment::with(['payable.requestor:id,name'])
            ->where('payable_type', TestingRequest::class)
            ->whereNotNull('payment_proof')
            ->whereNotIn('status', ['paid', 'verified', 'approved'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'payment_number' => $payment->payment_number,
                    'amount' => $payment->amount,
                    'requestor' => $payment->payable?->requestor?->name,
                    'activity_name' => $payment->payable?->activity_name,
                    'created_at' => $payment->created_at->format('d M Y'),
                ];
            });
    }
}
