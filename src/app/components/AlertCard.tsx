import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

interface AlertCardProps {
  title: string;
  description: string;
  metric: string;
  action: string;
  severity?: 'warning' | 'critical' | 'info';
}

export function AlertCard({ title, description, metric, action, severity = 'warning' }: AlertCardProps) {
  const severityColors = {
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    critical: 'text-red bg-red-light border-red',
    info: 'text-blue bg-blue-light border-blue'
  };

  return (
    <div className={`border rounded-lg p-5 ${severityColors[severity]}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="mb-1">{title}</h4>
          <p className="text-sm opacity-80 mb-3">{description}</p>
          <div className="text-sm mb-2">
            <span className="opacity-70">Metric: </span>
            <span>{metric}</span>
          </div>
          <div className="text-sm font-medium mt-3 pt-3 border-t border-current/20">
            Suggested action: {action}
          </div>
        </div>
      </div>
    </div>
  );
}
