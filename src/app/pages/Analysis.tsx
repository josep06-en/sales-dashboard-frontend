import { useState, useEffect } from 'react';
import { ChartContainer } from '../components/ChartContainer';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { staticDataService, formatCurrency, formatNumber, formatDate } from '../lib/static-data';
import type { TopProduct, Analysis, RevenueTrend } from '../lib/static-data';

export function Analysis() {
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [dailyKpis, setDailyKpis] = useState<RevenueTrend[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set default date range to last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadAnalysisData();
    }
  }, [startDate, endDate]);

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analysisData, productsData, kpisData] = await Promise.all([
        staticDataService.getAnalysis(),
        staticDataService.getTopProducts(),
        staticDataService.getRevenueTrend()
      ]);

      setAnalysis(analysisData);
      setProducts(productsData || []);
      setDailyKpis(kpisData || []);

    } catch (err) {
      console.error('Failed to load analysis data:', err);
      setError('Failed to load analysis data. Please check your connection and date range.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryComparison = () => {
    const categoryMap = new Map();
    
    products.forEach(product => {
      const category = product.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category: category.length > 15 ? category.substring(0, 15) + '...' : category,
          total_revenue: 0,
          total_orders: 0,
          total_quantity: 0
        });
      }
      
      const cat = categoryMap.get(category);
      cat.total_revenue += product.total_revenue;
      cat.total_orders += product.unique_orders;
      cat.total_quantity += product.total_quantity;
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 8);
  };

  const getRevenueTrendData = () => {
    return dailyKpis.map(kpi => ({
      date: formatDate(kpi.date),
      revenue: kpi.daily_revenue,
      orders: kpi.daily_orders,
      aov: kpi.daily_aov,
      growth: kpi.revenue_growth_pct || 0
    }));
  };

  const getPerformanceMetrics = () => {
    if (!analysis) return [];
    
    return [
      { metric: 'Period Revenue', value: analysis.period_revenue, format: 'currency' },
      { metric: 'Period Orders', value: analysis.period_orders, format: 'number' },
      { metric: 'Avg Order Value', value: analysis.period_aov, format: 'currency' },
      { metric: 'Daily Revenue', value: analysis.avg_daily_revenue, format: 'currency' },
      { metric: 'Growth Rate', value: analysis.growth_rate, format: 'percentage' },
      { metric: 'Volatility', value: analysis.revenue_volatility, format: 'currency' }
    ];
  };

  const getConversionFunnel = () => {
    if (!analysis) return [];
    
    // Simulate conversion funnel based on available data
    const visits = analysis.period_orders * 10; // Assume 10:1 visit to order ratio
    const productViews = analysis.period_orders * 5; // Assume 5:1 product view to order ratio
    const addToCart = Math.floor(analysis.period_orders * 1.3); // Assume some cart abandonment
    const checkout = Math.floor(analysis.period_orders * 1.1); // Assume some checkout abandonment
    const purchase = analysis.period_orders;

    return [
      { stage: 'Visits', count: visits, conversion: 100 },
      { stage: 'Product Views', count: productViews, conversion: (productViews / visits) * 100 },
      { stage: 'Add to Cart', count: addToCart, conversion: (addToCart / visits) * 100 },
      { stage: 'Checkout', count: checkout, conversion: (checkout / visits) * 100 },
      { stage: 'Purchase', count: purchase, conversion: (purchase / visits) * 100 }
    ];
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Analysis</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadAnalysisData}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const categoryData = getCategoryComparison();
  const revenueTrendData = getRevenueTrendData();
  const performanceMetrics = getPerformanceMetrics();
  const funnelData = getConversionFunnel();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2">Deep Analysis</h2>
        <p className="text-muted-foreground mb-4">Advanced exploration of trends, patterns, and comparisons</p>
        
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-1">{metric.metric}</h4>
              <p className="text-2xl font-bold">
                {metric.format === 'currency' && formatCurrency(metric.value)}
                {metric.format === 'number' && formatNumber(metric.value)}
                {metric.format === 'percentage' && `${(metric.value).toFixed(1)}%`}
              </p>
            </div>
          ))}
        </div>
      )}

      <ChartContainer title="Product Category Performance">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="category" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" tickFormatter={(value: number) => formatCurrency(value)} />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="total_revenue" fill="var(--blue)" name="Total Revenue" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Revenue Trend Analysis">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" tickFormatter={(value: number) => formatCurrency(value)} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                  name === 'revenue' ? 'Revenue' : name === 'orders' ? 'Orders' : 'AOV'
                ]}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="var(--blue)" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="orders" stroke="var(--green)" strokeWidth={2} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Top Products Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={products.slice(0, 8).map(p => ({
              name: p.product_id.length > 20 ? p.product_id.substring(0, 20) + '...' : p.product_id,
              revenue: p.total_revenue,
              orders: p.unique_orders
            }))} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" tickFormatter={(value: number) => formatCurrency(value)} />
              <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" width={120} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="var(--blue)" name="Revenue" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="Conversion Funnel Analysis">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={funnelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" stroke="var(--muted-foreground)" />
            <YAxis dataKey="stage" type="category" stroke="var(--muted-foreground)" width={120} />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'count' ? formatNumber(value) : `${value.toFixed(1)}%`,
                name === 'count' ? 'Count' : 'Conversion Rate'
              ]}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="var(--blue)" name="Count" radius={[0, 4, 4, 0]} />
            <Line dataKey="conversion" stroke="var(--green)" strokeWidth={2} name="Conversion %" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
