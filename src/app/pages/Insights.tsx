import { useState, useEffect } from 'react';
import { InsightCard } from '../components/InsightCard';
import { staticDataService, formatCurrency, formatNumber, formatPercentage, formatDate } from '../lib/static-data';
import type { Insights, TopProduct, Analysis } from '../lib/static-data';

export function Insights() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [kpiOverview, setKpiOverview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsightsData();
  }, []);

  const loadInsightsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [insightsData, productsData, overviewData] = await Promise.all([
        staticDataService.getInsights(),
        staticDataService.getTopProducts(),
        staticDataService.getKPIOverview()
      ]);

      setInsights(insightsData);
      setTopProducts(productsData || []);
      setKpiOverview(overviewData);

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
                description={`${formatDate(kpiOverview?.best_day?.date || '')} achieved ${formatCurrency(kpiOverview?.best_day?.revenue || 0)} in revenue with ${formatNumber(kpiOverview?.best_day?.orders || 0)} orders.`}
                impact="high"
              />
              <InsightCard
                title="Worst Performance Day"
                description={`${formatDate(kpiOverview?.worst_day?.date || '')} recorded ${formatCurrency(kpiOverview?.worst_day?.revenue || 0)} in revenue with ${formatNumber(kpiOverview?.worst_day?.orders || 0)} orders.`}
                impact={(kpiOverview?.worst_day?.revenue || 0) < (kpiOverview?.best_day?.revenue || 0) * 0.5 ? 'high' : 'medium'}
              />
              <InsightCard
                title="Growth Analysis"
                description={`Recent 7-day growth is ${formatPercentage(kpiOverview?.growth_trends?.recent_7_days || 0)} with overall period growth of ${formatPercentage(kpiOverview?.growth_trends?.overall_period || 0)}.`}
                impact={Math.abs(kpiOverview?.growth_trends?.recent_7_days || 0) > 10 ? 'high' : 'medium'}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-muted-foreground">Product Analysis</h3>
            <div className="space-y-4">
              <InsightCard
                title="Top Product Performance"
                description={`Product ${kpiOverview?.product_analysis?.top_product?.id || 'N/A'} leads with ${formatCurrency(kpiOverview?.product_analysis?.top_product?.revenue || 0)} in revenue.`}
                impact="high"
              />
              {(kpiOverview?.product_analysis?.concentration_pct || 0) > 30 && (
                <InsightCard
                  title="Product Concentration Risk"
                  description={`Top product represents ${formatPercentage(kpiOverview?.product_analysis?.concentration_pct || 0)} of total revenue. Consider diversification strategies.`}
                  impact="high"
                />
              )}
              {topProducts.length > 1 && (
                <InsightCard
                  title="Product Portfolio Balance"
                  description={`Top 3 products account for ${formatPercentage(
                    (topProducts.slice(0, 3).reduce((sum, p) => sum + p.revenue, 0) / 
                     topProducts.reduce((sum, p) => sum + p.revenue, 0)) * 100
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
                description={`${formatNumber(kpiOverview?.alerts_summary?.total_alerts || 0)} active alerts including ${formatNumber(kpiOverview?.alerts_summary?.high_severity || 0)} high severity and ${formatNumber(kpiOverview?.alerts_summary?.revenue_drops || 0)} revenue drop alerts.`}
                impact={(kpiOverview?.alerts_summary?.high_severity || 0) > 0 ? 'high' : 'medium'}
              />
              {kpiOverview && (
                <>
                  <InsightCard
                    title="Overall Business Scale"
                    description={`Total revenue of ${formatCurrency(kpiOverview.total_revenue)} from ${formatNumber(kpiOverview.total_orders)} orders with average order value of ${formatCurrency(kpiOverview.avg_aov)}.`}
                    impact="medium"
                  />
                  <InsightCard
                    title="Data Coverage"
                    description={`Analytics cover ${formatNumber(kpiOverview.period_count)} data points.`}
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
                    key={product.product}
                    title={`#${index + 1} Product: ${product.product}`}
                    description={`${formatCurrency(product.revenue)} revenue with average price of ${formatCurrency(product.avg_price)} in ${product.category} category.`}
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
