import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  trend?: number;
  subtitle?: string;
}

export function KPICard({ label, value, trend, subtitle }: KPICardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="text-muted-foreground text-sm mb-2">{label}</div>
      <div className="text-3xl mb-2">{value}</div>
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive && (
            <>
              <TrendingUp className="w-4 h-4 text-green" />
              <span className="text-sm text-green">+{trend}%</span>
            </>
          )}
          {isNegative && (
            <>
              <TrendingDown className="w-4 h-4 text-red" />
              <span className="text-sm text-red">{trend}%</span>
            </>
          )}
          {subtitle && <span className="text-sm text-muted-foreground ml-1">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
