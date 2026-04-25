import { useState, useEffect } from 'react';
import { ChartContainer } from '../components/ChartContainer';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { staticDataService, formatCurrency, formatNumber, formatDate } from '../lib/static-data';
import type { RevenueTrend } from '../lib/static-data';

export function Metrics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [kpis, setKpis] = useState<RevenueTrend[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetricsData();
  }, [period]);

  const loadMetricsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await staticDataService.getRevenueTrend();
      setKpis(data || []);

    } catch (err) {
      console.error('Failed to load metrics data:', err);
      setError('Failed to load metrics data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getRevenueData = () => {
    return kpis.map((kpi: any, index: number) => ({
      period: period === 'daily' ? formatDate(kpi.date) : 
             period === 'weekly' ? kpi.week : kpi.month,
      current: kpi.daily_revenue || kpi.weekly_revenue || kpi.monthly_revenue,
      previous: index > 0 ? (kpi.daily_revenue || kpi.weekly_revenue || kpi.monthly_revenue) * 0.9 : 0,
      growth: kpi.revenue_growth_pct || kpi.revenue_wow_growth || kpi.revenue_mom_growth || 0
    }));
  };

  const getOrderData = () => {
    return kpis.map((kpi: any) => ({
      period: period === 'daily' ? formatDate(kpi.date) : 
             period === 'weekly' ? kpi.week : kpi.month,
      orders: kpi.daily_orders || kpi.weekly_orders || kpi.monthly_orders,
      growth: kpi.orders_growth_pct || kpi.orders_wow_growth || kpi.orders_mom_growth || 0
    }));
  };

  const getAOVData = () => {
    return kpis.map((kpi: any) => ({
      period: period === 'daily' ? formatDate(kpi.date) : 
             period === 'weekly' ? kpi.week : kpi.month,
      aov: kpi.daily_aov || kpi.weekly_aov || kpi.monthly_aov
    }));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Metrics</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadMetricsData}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const revenueData = getRevenueData();
  const orderData = getOrderData();
  const aovData = getAOVData();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2">Detailed Metrics</h2>
        <p className="text-muted-foreground mb-4">Deep dive into performance trends and patterns</p>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-4 py-2 rounded transition-colors ${
              period === 'daily' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded transition-colors ${
              period === 'weekly' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded transition-colors ${
              period === 'monthly' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <ChartContainer title={`Revenue Trends – ${period.charAt(0).toUpperCase() + period.slice(1)}`}>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--blue)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="period" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" tickFormatter={(value: number) => formatCurrency(value)} />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'current' ? 'Current Period' : 'Previous Period'
              ]}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="current" stroke="var(--blue)" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={2} name="Current Period" />
            <Area type="monotone" dataKey="previous" stroke="var(--muted-foreground)" fillOpacity={1} fill="url(#colorPrevious)" strokeWidth={2} name="Previous Period" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title={`Order Volume – ${period.charAt(0).toUpperCase() + period.slice(1)}`}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="period" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                formatter={(value: number) => [formatNumber(value), 'Orders']}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="orders" stroke="var(--green)" strokeWidth={2} dot={{ fill: 'var(--green)' }} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title={`Average Order Value – ${period.charAt(0).toUpperCase() + period.slice(1)}`}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aovData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="period" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" tickFormatter={(value: number) => formatCurrency(value)} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'AOV']}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="aov" stroke="var(--blue)" strokeWidth={2} dot={{ fill: 'var(--blue)' }} name="AOV" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
