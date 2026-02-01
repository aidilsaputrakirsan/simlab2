export interface AdminPengujianStats {
    pending_verification: number
    total_requests_this_month: number
    total_revenue_this_month: number
    pending_payment_verification: number
}

export interface TrendData {
    month: string
    month_short: string
    count?: number
    amount?: number
}

export interface PopularTestingType {
    id: number
    name: string
    total_requests: number
    total_quantity: number
}

export interface CategoryDistribution {
    id: number
    name: string
    total_requests: number
}

export interface StatusDistribution {
    status: string
    label: string
    count: number
}

export interface RecentRequest {
    id: number
    activity_name: string
    requestor: string
    status: string
    testing_time: string
    created_at: string
    items_count: number
}

export interface PendingVerification {
    id: number
    activity_name: string
    requestor: string
    testing_time: string
    created_at: string
}

export interface PendingPayment {
    id: number
    payment_number: string
    amount: number
    requestor: string
    activity_name: string
    created_at: string
}

export interface AdminPengujianDashboardData {
    stats: AdminPengujianStats
    request_trend: TrendData[]
    revenue_trend: TrendData[]
    popular_testing_types: PopularTestingType[]
    category_distribution: CategoryDistribution[]
    status_distribution: StatusDistribution[]
    recent_requests: RecentRequest[]
    pending_verification: PendingVerification[]
    pending_payments: PendingPayment[]
}
