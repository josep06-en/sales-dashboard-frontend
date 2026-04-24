import { useState, useEffect } from 'react';
import { KPICard } from '../components/KPICard';
import { ChartContainer } from '../components/ChartContainer';
import { InsightCard } from '../components/InsightCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiClient, formatCurrency, formatNumber, formatPercentage, formatDate } from '../lib/api';
import type { KPIOverview, DailyKPI, ProductMetric, Insights } from '../lib/api';

export function Overview() {
  const [loading, setLoading] = useState(true);
  const [kpiOverview, setKpiOverview] = useState<KPIOverview | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<ProductMetric[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [overview, revenueTrend, products, insightsData] = await Promise.all([
        apiClient.getKPIOverview('daily'),
        apiClient.getRevenueTrend('daily'),
        apiClient.getTopProducts(5),
        apiClient.getInsights()
      ]);

      setKpiOverview(overview);
      setRevenueData(revenueTrend.data.map((item: any) => ({
        date: formatDate(item.date || item.month || item.week),
        revenue: item.daily_revenue || item.weekly_revenue || item.monthly_revenue
      })));
      setTopProducts(products.map(product => ({
        ...product,
        name: product.product_id.length > 20 ? product.product_id.substring(0, 20) + '...' : product.product_id,
        sales: product.total_revenue
      })));
      setInsights(insightsData);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-6">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard 
            label="Total Revenue" 
            value={formatCurrency(kpiOverview?.total_revenue || 0)} 
            trend={insights?.growth_trends.recent_7_days || 0} 
            subtitle="Last 7 days" 
          />
          <KPICard 
            label="Total Orders" 
            value={formatNumber(kpiOverview?.total_orders || 0)} 
            trend={8.2} 
            subtitle="Last 7 days" 
          />
          <KPICard 
            label="Average Order Value" 
            value={formatCurrency(kpiOverview?.avg_aov || 0)} 
            trend={-2.1} 
            subtitle="Last 7 days" 
          />
          <KPICard 
            label="Growth Rate" 
            value={formatPercentage(insights?.growth_trends.recent_7_days || 0)} 
            trend={3.4} 
            subtitle="vs last period" 
          />
        </div>
      </div>

      <ChartContainer title="Revenue Trend">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip
              formatter={(value: any) => [formatCurrency(value), 'Revenue']}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="revenue" stroke="var(--blue)" strokeWidth={2} dot={{ fill: 'var(--blue)' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Top Products by Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" width={120} />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="sales" fill="var(--blue)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="space-y-4">
          <h3>Key Insights</h3>
          {insights && (
            <>
              <InsightCard
                title="Best Performance Day"
                description={`${formatDate(insights.best_day.date)} achieved ${formatCurrency(insights.best_day.revenue)} in revenue with ${insights.best_day.orders} orders.`}
                impact="high"
              />
              <InsightCard
                title="Growth Trend"
                description={`Recent 7-day growth is ${formatPercentage(insights.growth_trends.recent_7_days)} with overall period growth of ${formatPercentage(insights.growth_trends.overall_period)}.`}
                impact={Math.abs(insights.growth_trends.recent_7_days) > 10 ? 'high' : 'medium'}
              />
              {insights.product_analysis.concentration_pct > 30 && (
                <InsightCard
                  title="Product Concentration Alert"
                  description={`Top product represents ${formatPercentage(insights.product_analysis.concentration_pct)} of total revenue. Consider diversification.`}
                  impact="high"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
