import { useState, useEffect } from 'react';
import { InsightCard } from '../components/InsightCard';
import { apiClient, formatCurrency, formatNumber, formatPercentage, formatDate } from '../lib/api';
import type { Insights, ProductMetric } from '../lib/api';

export function Insights() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [topProducts, setTopProducts] = useState<ProductMetric[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsightsData();
  }, []);

  const loadInsightsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [insightsData, productsData, summaryData] = await Promise.all([
        apiClient.getInsights(),
        apiClient.getTopProducts(10),
        apiClient.getSummary()
      ]);

      setInsights(insightsData);
      setTopProducts(productsData);
      setSummary(summaryData);

    } catch (err) {
      console.error('Failed to load insights data:', err);
      setError('Failed to load insights data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Insights</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadInsightsData}
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
        <h2 className="mb-2">Business Insights</h2>
        <p className="text-muted-foreground">Understand what's driving your metrics and why it matters</p>
      </div>

      {insights && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-muted-foreground">Performance Highlights</h3>
            <div className="space-y-4">
              <InsightCard
                title="Best Performance Day"
                description={`${formatDate(insights.best_day.date)} achieved ${formatCurrency(insights.best_day.revenue)} in revenue with ${formatNumber(insights.best_day.orders)} orders.`}
                impact="high"
              />
              <InsightCard
                title="Worst Performance Day"
                description={`${formatDate(insights.worst_day.date)} recorded ${formatCurrency(insights.worst_day.revenue)} in revenue with ${formatNumber(insights.worst_day.orders)} orders.`}
                impact={insights.worst_day.revenue < insights.best_day.revenue * 0.5 ? 'high' : 'medium'}
              />
              <InsightCard
                title="Growth Analysis"
                description={`Recent 7-day growth is ${formatPercentage(insights.growth_trends.recent_7_days)} with overall period growth of ${formatPercentage(insights.growth_trends.overall_period)}.`}
                impact={Math.abs(insights.growth_trends.recent_7_days) > 10 ? 'high' : 'medium'}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-muted-foreground">Product Analysis</h3>
            <div className="space-y-4">
              <InsightCard
                title="Top Product Performance"
                description={`Product ${insights.product_analysis.top_product.id} leads with ${formatCurrency(insights.product_analysis.top_product.revenue)} in revenue.`}
                impact="high"
              />
              {insights.product_analysis.concentration_pct > 30 && (
                <InsightCard
                  title="Product Concentration Risk"
                  description={`Top product represents ${formatPercentage(insights.product_analysis.concentration_pct)} of total revenue. Consider diversification strategies.`}
                  impact="high"
                />
              )}
              {topProducts.length > 1 && (
                <InsightCard
                  title="Product Portfolio Balance"
                  description={`Top 3 products account for ${formatPercentage(
                    (topProducts.slice(0, 3).reduce((sum, p) => sum + p.total_revenue, 0) / 
                     topProducts.reduce((sum, p) => sum + p.total_revenue, 0)) * 100
                  )} of total revenue across ${formatNumber(topProducts.length)} products.`}
                  impact={topProducts.length < 10 ? 'medium' : 'low'}
                />
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-muted-foreground">Business Health</h3>
            <div className="space-y-4">
              <InsightCard
                title="Alert Summary"
                description={`${formatNumber(insights.alerts_summary.total_alerts)} active alerts including ${formatNumber(insights.alerts_summary.high_severity)} high severity and ${formatNumber(insights.alerts_summary.revenue_drops)} revenue drop alerts.`}
                impact={insights.alerts_summary.high_severity > 0 ? 'high' : 'medium'}
              />
              {summary && (
                <>
                  <InsightCard
                    title="Overall Business Scale"
                    description={`Total revenue of ${formatCurrency(summary.total_revenue)} from ${formatNumber(summary.total_orders)} orders with average order value of ${formatCurrency(summary.total_revenue / summary.total_orders)}.`}
                    impact="medium"
                  />
                  <InsightCard
                    title="Data Coverage"
                    description={`Analytics cover ${formatNumber(summary.period_count)} data points from ${formatDate(summary.date_range?.start)} to ${formatDate(summary.date_range?.end)}.`}
                    impact="low"
                  />
                </>
              )}
            </div>
          </div>

          {topProducts.length > 0 && (
            <div>
              <h3 className="mb-4 text-muted-foreground">Product Performance Insights</h3>
              <div className="space-y-4">
                {topProducts.slice(0, 3).map((product, index) => (
                  <InsightCard
                    key={product.product_id}
                    title={`#${index + 1} Product: ${product.product_id}`}
                    description={`${formatCurrency(product.total_revenue)} revenue from ${formatNumber(product.unique_orders)} orders with average price of ${formatCurrency(product.avg_price)} in ${product.category} category.`}
                    impact={index === 0 ? 'high' : index === 1 ? 'medium' : 'low'}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
