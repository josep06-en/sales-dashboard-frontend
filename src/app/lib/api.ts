/**
 * API Integration Layer for Sales KPI Analytics Frontend
 * 
 * This module handles all communication with the backend API.
 * It's configured to work with the backend deployed on Vercel.
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types based on backend API responses
export interface DailyKPI {
  date: string;
  daily_revenue: number;
  daily_orders: number;
  daily_aov: number;
  revenue_growth_pct?: number;
  orders_growth_pct?: number;
}

export interface WeeklyKPI {
  week: string;
  weekly_revenue: number;
  weekly_orders: number;
  weekly_aov: number;
  revenue_wow_growth?: number;
  orders_wow_growth?: number;
}

export interface MonthlyKPI {
  month: string;
  monthly_revenue: number;
  monthly_orders: number;
  monthly_aov: number;
  revenue_mom_growth?: number;
  orders_mom_growth?: number;
}

export interface ProductMetric {
  product_id: string;
  category: string;
  total_revenue: number;
  unique_orders: number;
  total_quantity: number;
  avg_price: number;
  revenue_rank: number;
}

export interface Alert {
  type: string;
  date: string;
  value: number;
  severity: string;
  product_id?: string;
}

export interface KPIOverview {
  total_revenue: number;
  total_orders: number;
  avg_aov: number;
  period_count: number;
}

export interface PerformanceAnalysis {
  period_revenue: number;
  period_orders: number;
  period_aov: number;
  avg_daily_revenue: number;
  revenue_volatility: number;
  growth_rate: number;
  days_analyzed: number;
}

export interface Insights {
  best_day: {
    date: string;
    revenue: number;
    orders: number;
  };
  worst_day: {
    date: string;
    revenue: number;
    orders: number;
  };
  growth_trends: {
    recent_7_days: number;
    overall_period: number;
  };
  product_analysis: {
    top_product: {
      id: string;
      revenue: number;
    };
    concentration_pct: number;
  };
  alerts_summary: {
    total_alerts: number;
    high_severity: number;
    revenue_drops: number;
  };
}

// API Client Class
class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Remove trailing slash from baseURL and leading slash from endpoint to avoid double slashes
    const cleanBaseURL = this.baseURL.replace(/\/$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseURL}${cleanEndpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      // Log the response for debugging
      console.log(`API Response for ${endpoint}:`, result);
      
      return result;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    return this.request('/');
  }

  // KPIs
  async getKPIs(period: 'daily' | 'weekly' | 'monthly' = 'daily', 
                 startDate?: string, endDate?: string): Promise<DailyKPI[] | WeeklyKPI[] | MonthlyKPI[]> {
    const params = new URLSearchParams();
    params.append('period', period);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    try {
      const response = await this.request(`/kpis?${params}`) as {data: DailyKPI[] | WeeklyKPI[] | MonthlyKPI[]};
      return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      console.error('Error in getKPIs:', error);
      return [];
    }
  }

  async getKPIOverview(period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<KPIOverview> {
    return this.request(`/kpis/overview?period=${period}`);
  }

  // Revenue Trends
  async getRevenueTrend(period: 'daily' | 'weekly' | 'monthly' = 'daily',
                       startDate?: string, endDate?: string): Promise<{
    period: string;
    data: any[];
    total_records: number;
  }> {
    const params = new URLSearchParams();
    params.append('period', period);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    try {
      const response = await this.request(`/revenue-trend?${params}`) as {data: any[], total_records: number};
      return {
        period,
        data: Array.isArray(response?.data) ? response.data : [],
        total_records: response?.total_records || 0
      };
    } catch (error) {
      console.error('Error in getRevenueTrend:', error);
      return {
        period,
        data: [],
        total_records: 0
      };
    }
  }

  // Products
  async getTopProducts(topN: number = 10, category?: string): Promise<ProductMetric[]> {
    const params = new URLSearchParams();
    params.append('top_n', topN.toString());
    if (category) params.append('category', category);
    
    try {
      const response = await this.request(`/top-products?${params}`) as {data: ProductMetric[]};
      return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      console.error('Error in getTopProducts:', error);
      return [];
    }
  }

  async getProducts(topN?: number, category?: string, minRevenue?: number): Promise<ProductMetric[]> {
    const params = new URLSearchParams();
    if (topN) params.append('top_n', topN.toString());
    if (category) params.append('category', category);
    if (minRevenue) params.append('min_revenue', minRevenue.toString());
    
    try {
      const response = await this.request(`/products?${params}`) as {data: ProductMetric[]};
      return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      console.error('Error in getProducts:', error);
      return [];
    }
  }

  // Insights
  async getInsights(): Promise<Insights> {
    return this.request('/insights');
  }

  // Alerts
  async getAlerts(alertType?: string, severity?: string): Promise<Alert[]> {
    const params = new URLSearchParams();
    if (alertType) params.append('alert_type', alertType);
    if (severity) params.append('severity', severity);
    
    try {
      const response = await this.request(`/alerts?${params}`) as {data: Alert[]};
      return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      console.error('Error in getAlerts:', error);
      return [];
    }
  }

  // Analysis
  async getPerformanceAnalysis(startDate: string, endDate: string): Promise<PerformanceAnalysis> {
    return this.request(`/analysis?start_date=${startDate}&end_date=${endDate}`);
  }

  // Summary
  async getSummary(): Promise<any> {
    return this.request('/summary');
  }

  // Sales Data (raw)
  async getSalesData(startDate?: string, endDate?: string, 
                    productId?: string, category?: string, limit: number = 1000): Promise<{
    data: any[];
    total_records: number;
    filters_applied: any;
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (productId) params.append('product_id', productId);
    if (category) params.append('category', category);
    params.append('limit', limit.toString());
    
    try {
      const response = await this.request(`/sales?${params}`) as {data: any[], total_records: number, filters_applied: any};
      return {
        data: Array.isArray(response?.data) ? response.data : [],
        total_records: response?.total_records || 0,
        filters_applied: response?.filters_applied || {}
      };
    } catch (error) {
      console.error('Error in getSalesData:', error);
      return {
        data: [],
        total_records: 0,
        filters_applied: {}
      };
    }
  }
}

// Create and export API client instance
export const apiClient = new APIClient();

// Utility functions for data formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (pct: number): string => {
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getGrowthColor = (growth: number): string => {
  if (growth > 0) return 'text-green-600';
  if (growth < 0) return 'text-red-600';
  return 'text-gray-600';
};

export const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// React Query hooks (if using @tanstack/react-query)
export const useKPIs = (period: 'daily' | 'weekly' | 'monthly' = 'daily', 
                        startDate?: string, endDate?: string) => {
  // This would be implemented with @tanstack/react-query
  // For now, returning a basic fetch implementation
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: () => apiClient.getKPIs(period, startDate, endDate),
  };
};

export default apiClient;
