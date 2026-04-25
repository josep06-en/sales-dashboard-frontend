/**
 * Static Data Integration Layer for Sales KPI Analytics Frontend
 * 
 * This module handles all data loading from static JSON files.
 * No backend API required - fully static architecture.
 */

// Types based on static JSON data structure
export interface KPIs {
  revenue: number;
  orders: number;
  aov: number;
  growth: number;
}

export interface KPIOverview {
  total_revenue: number;
  total_orders: number;
  avg_aov: number;
  period_count: number;
  growth_trends: {
    recent_7_days: number;
    overall_period: number;
  };
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

export interface RevenueTrend {
  date: string;
  revenue: number;
}

export interface TopProduct {
  product: string;
  revenue: number;
  category: string;
  quantity: number;
  avg_price: number;
}

export interface Insights {
  summary: string;
  key_findings: string[];
}

export interface Alert {
  type: string;
  message: string;
  severity: string;
}

export interface Analysis {
  best_product: string;
  worst_product: string;
  trend: string;
  dominant_category: string;
  total_products: number;
  avg_revenue_per_product: number;
  revenue_volatility: number;
}

/**
 * Static Data Service
 * Loads data from JSON files in /public/data/
 */
class StaticDataService {
  private static instance: StaticDataService;
  private cache: Map<string, any> = new Map();

  static getInstance(): StaticDataService {
    if (!StaticDataService.instance) {
      StaticDataService.instance = new StaticDataService();
    }
    return StaticDataService.instance;
  }

  /**
   * Load JSON data from public/data directory
   */
  private async loadJSON<T>(filename: string): Promise<T | null> {
    // Check cache first
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    try {
      const response = await fetch(`/data/${filename}`);
      
      if (!response.ok) {
        console.error(`Failed to load ${filename}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(filename, data);
      
      return data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return null;
    }
  }

  /**
   * Get main KPIs
   */
  async getKPIs(): Promise<KPIs | null> {
    return this.loadJSON<KPIs>('kpis.json');
  }

  /**
   * Get detailed KPI overview
   */
  async getKPIOverview(): Promise<KPIOverview | null> {
    return this.loadJSON<KPIOverview>('kpis_overview.json');
  }

  /**
   * Get revenue trend data
   */
  async getRevenueTrend(): Promise<RevenueTrend[] | null> {
    return this.loadJSON<RevenueTrend[]>('revenue_trend.json');
  }

  /**
   * Get top products
   */
  async getTopProducts(): Promise<TopProduct[] | null> {
    return this.loadJSON<TopProduct[]>('top_products.json');
  }

  /**
   * Get business insights
   */
  async getInsights(): Promise<Insights | null> {
    return this.loadJSON<Insights>('insights.json');
  }

  /**
   * Get alerts
   */
  async getAlerts(): Promise<Alert[] | null> {
    return this.loadJSON<Alert[]>('alerts.json');
  }

  /**
   * Get comprehensive analysis
   */
  async getAnalysis(): Promise<Analysis | null> {
    return this.loadJSON<Analysis>('analysis.json');
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Health check for static data
   */
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    try {
      const kpis = await this.getKPIs();
      return {
        status: kpis ? 'healthy' : 'error',
        service: 'static-data-service',
        version: '1.0.0'
      };
    } catch (error) {
      return {
        status: 'error',
        service: 'static-data-service',
        version: '1.0.0'
      };
    }
  }
}

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

// Export singleton instance
export const staticDataService = StaticDataService.getInstance();

// Export types for backward compatibility
export type {
  DailyKPI,
  WeeklyKPI,
  MonthlyKPI,
  ProductMetric,
  PerformanceAnalysis
} from './api';
