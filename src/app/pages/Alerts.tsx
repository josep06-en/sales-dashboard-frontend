import { useState, useEffect } from 'react';
import { AlertCard } from '../components/AlertCard';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { apiClient, formatPercentage, formatDate, getSeverityColor } from '../lib/api';
import type { Alert } from '../lib/api';

export function Alerts() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getAlerts();
      setAlerts(data);

    } catch (err) {
      console.error('Failed to load alerts:', err);
      setError('Failed to load alerts data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAlerts = () => {
    if (filter === 'all') return alerts;
    return alerts.filter(alert => alert.severity === filter);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'revenue_drop':
        return '📉';
      case 'revenue_spike':
        return '📈';
      case 'product_concentration':
        return '🎯';
      default:
        return '⚠️';
    }
  };

  const getAlertTitle = (alert: Alert) => {
    switch (alert.type) {
      case 'revenue_drop':
        return `Revenue Drop Detected`;
      case 'revenue_spike':
        return `Revenue Spike Detected`;
      case 'product_concentration':
        return `Product Concentration Risk`;
      default:
        return `Business Alert`;
    }
  };

  const getAlertDescription = (alert: Alert) => {
    switch (alert.type) {
      case 'revenue_drop':
        return `Revenue decreased by ${formatPercentage(alert.value)} on ${formatDate(alert.date)}. This may indicate market changes or operational issues.`;
      case 'revenue_spike':
        return `Revenue increased by ${formatPercentage(alert.value)} on ${formatDate(alert.date)}. This represents unusually strong performance.`;
      case 'product_concentration':
        return `Top product represents ${formatPercentage(alert.value)} of total revenue. High concentration may indicate dependency risk.`;
      default:
        return `Alert triggered on ${formatDate(alert.date)} with value ${formatPercentage(alert.value)}.`;
    }
  };

  const getAlertAction = (alert: Alert) => {
    switch (alert.type) {
      case 'revenue_drop':
        return 'Investigate marketing campaigns, competitor activities, and operational issues. Consider promotional recovery strategies.';
      case 'revenue_spike':
        return 'Analyze drivers of exceptional performance. Identify successful strategies to replicate and scale.';
      case 'product_concentration':
        return 'Develop diversification strategies. Expand product portfolio and reduce dependency on single products.';
      default:
        return 'Review business metrics and investigate underlying causes.';
    }
  };

  const getAlertMetric = (alert: Alert) => {
    switch (alert.type) {
      case 'revenue_drop':
      case 'revenue_spike':
        return `Change: ${formatPercentage(alert.value)}`;
      case 'product_concentration':
        return `Concentration: ${formatPercentage(alert.value)}`;
      default:
        return `Value: ${formatPercentage(alert.value)}`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Alerts</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadAlerts}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredAlerts = getFilteredAlerts();
  const highSeverityAlerts = filteredAlerts.filter(a => a.severity === 'high');
  const mediumSeverityAlerts = filteredAlerts.filter(a => a.severity === 'medium');
  const lowSeverityAlerts = filteredAlerts.filter(a => a.severity === 'low');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2">Active Alerts</h2>
        <p className="text-muted-foreground mb-4">Items requiring attention and recommended actions</p>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'high' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            High ({alerts.filter(a => a.severity === 'high').length})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'medium' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Medium ({alerts.filter(a => a.severity === 'medium').length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'low' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Low ({alerts.filter(a => a.severity === 'low').length})
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {highSeverityAlerts.length > 0 && (
          <div>
            <h3 className="mb-4 text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              High Severity
            </h3>
            <div className="space-y-4">
              {highSeverityAlerts.map((alert, index) => (
                <AlertCard
                  key={index}
                  title={`${getAlertIcon(alert.type)} ${getAlertTitle(alert)}`}
                  description={getAlertDescription(alert)}
                  metric={getAlertMetric(alert)}
                  action={getAlertAction(alert)}
                  severity="critical"
                />
              ))}
            </div>
          </div>
        )}

        {mediumSeverityAlerts.length > 0 && (
          <div>
            <h3 className="mb-4 text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              Medium Severity
            </h3>
            <div className="space-y-4">
              {mediumSeverityAlerts.map((alert, index) => (
                <AlertCard
                  key={index}
                  title={`${getAlertIcon(alert.type)} ${getAlertTitle(alert)}`}
                  description={getAlertDescription(alert)}
                  metric={getAlertMetric(alert)}
                  action={getAlertAction(alert)}
                  severity="warning"
                />
              ))}
            </div>
          </div>
        )}

        {lowSeverityAlerts.length > 0 && (
          <div>
            <h3 className="mb-4 text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Low Severity
            </h3>
            <div className="space-y-4">
              {lowSeverityAlerts.map((alert, index) => (
                <AlertCard
                  key={index}
                  title={`${getAlertIcon(alert.type)} ${getAlertTitle(alert)}`}
                  description={getAlertDescription(alert)}
                  metric={getAlertMetric(alert)}
                  action={getAlertAction(alert)}
                  severity="info"
                />
              ))}
            </div>
          </div>
        )}

        {filteredAlerts.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-green-800 mb-2">All Systems Nominal</h4>
                <p className="text-sm text-green-700">
                  {filter === 'all' 
                    ? 'No active alerts detected. All business metrics are within normal parameters.'
                    : `No ${filter} severity alerts detected.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
