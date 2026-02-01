import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { Skeleton } from "@/presentation/components/ui/skeleton"
import { useAdminPengujianDashboard } from "../hooks/useAdminPengujianDashboard"
import {
    ClipboardCheck,
    FileText,
    Wallet,
    CreditCard,
    TrendingUp,
    FlaskConical
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts"
import { useNavigate } from "react-router-dom"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value)
}

export const AdminPengujianDashboard = () => {
    const { dashboardData, isLoading } = useAdminPengujianDashboard()
    const navigate = useNavigate()

    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Gagal memuat data dashboard</p>
            </div>
        )
    }

    const {
        stats,
        request_trend,
        revenue_trend,
        popular_testing_types,
        category_distribution,
        status_distribution,
        recent_requests,
        pending_verification,
        pending_payments
    } = dashboardData

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Menunggu Verifikasi"
                    value={stats.pending_verification}
                    description="Pengajuan perlu diverifikasi"
                    icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
                    onClick={() => navigate('/panel/pengujian/verification')}
                />
                <StatsCard
                    title="Pengajuan Bulan Ini"
                    value={stats.total_requests_this_month}
                    description="Total pengajuan pengujian"
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Pendapatan Bulan Ini"
                    value={formatCurrency(stats.total_revenue_this_month)}
                    description="Dari pembayaran terverifikasi"
                    icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Pembayaran Pending"
                    value={stats.pending_payment_verification}
                    description="Menunggu verifikasi bukti"
                    icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                    onClick={() => navigate('/panel/pembayaran')}
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Request Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Tren Pengajuan
                        </CardTitle>
                        <CardDescription>Jumlah pengajuan 6 bulan terakhir</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={request_trend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month_short" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [value, 'Pengajuan']}
                                    labelFormatter={(label) => `Bulan: ${label}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#0088FE"
                                    strokeWidth={2}
                                    dot={{ fill: '#0088FE' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Revenue Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Pendapatan Bulanan
                        </CardTitle>
                        <CardDescription>Total pendapatan 6 bulan terakhir</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={revenue_trend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month_short" />
                                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} />
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value as number), 'Pendapatan']}
                                    labelFormatter={(label) => `Bulan: ${label}`}
                                />
                                <Bar dataKey="amount" fill="#00C49F" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Second Charts Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Popular Testing Types */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FlaskConical className="h-4 w-4" />
                            Jenis Pengujian Terpopuler
                        </CardTitle>
                        <CardDescription>Top 10 jenis pengujian paling banyak diminta</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={popular_testing_types} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={150}
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                                />
                                <Tooltip />
                                <Bar dataKey="total_requests" fill="#8884D8" radius={[0, 4, 4, 0]} name="Jumlah Request" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Kategori</CardTitle>
                        <CardDescription>Berdasarkan kategori pengujian</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={category_distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="total_requests"
                                    nameKey="name"
                                    label={false}
                                >
                                    {category_distribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, name]} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Custom Legend */}
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {category_distribution.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-1.5 text-xs">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-muted-foreground">
                                        {item.name} ({item.total_requests})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Distribution */}
            <div className="grid gap-4 md:grid-cols-6">
                {status_distribution.map((status) => (
                    <Card key={status.status}>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{status.count}</p>
                                <p className="text-sm text-muted-foreground">{status.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tables Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Recent Requests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pengajuan Terbaru</CardTitle>
                        <CardDescription>5 pengajuan terakhir</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recent_requests.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">Belum ada pengajuan</p>
                            ) : (
                                recent_requests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-start justify-between border-b pb-3 last:border-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded"
                                        onClick={() => navigate(`/panel/pengujian/${request.id}`)}
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none truncate max-w-[200px]">
                                                {request.activity_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{request.requestor}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">{request.created_at}</p>
                                            <StatusBadge status={request.status} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Verification */}
                <Card>
                    <CardHeader>
                        <CardTitle>Menunggu Verifikasi</CardTitle>
                        <CardDescription>Pengajuan yang perlu diproses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pending_verification.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">Tidak ada pengajuan pending</p>
                            ) : (
                                pending_verification.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-start justify-between border-b pb-3 last:border-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded"
                                        onClick={() => navigate(`/panel/pengujian/${request.id}`)}
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none truncate max-w-[200px]">
                                                {request.activity_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{request.requestor}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{request.created_at}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Payments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pembayaran Pending</CardTitle>
                        <CardDescription>Menunggu verifikasi bukti</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pending_payments.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">Tidak ada pembayaran pending</p>
                            ) : (
                                pending_payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-start justify-between border-b pb-3 last:border-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded"
                                        onClick={() => navigate('/panel/pembayaran')}
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{payment.payment_number}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                {payment.requestor}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                                            <p className="text-xs text-muted-foreground">{payment.created_at}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

interface StatsCardProps {
    title: string
    value: string | number
    description: string
    icon: React.ReactNode
    onClick?: () => void
}

const StatsCard = ({ title, value, description, icon, onClick }: StatsCardProps) => (
    <Card
        className={onClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
        onClick={onClick}
    >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
)

const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<string, { label: string, className: string }> = {
        draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
        pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
        approved: { label: 'Disetujui', className: 'bg-green-100 text-green-800' },
        rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-800' },
        completed: { label: 'Selesai', className: 'bg-blue-100 text-blue-800' },
        cancelled: { label: 'Dibatalkan', className: 'bg-gray-100 text-gray-800' },
    }

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' }

    return (
        <span className={`text-xs px-2 py-0.5 rounded-full ${config.className}`}>
            {config.label}
        </span>
    )
}

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-20 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[250px] w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
)
