import { Lightbulb } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  impact?: 'high' | 'medium' | 'low';
}

export function InsightCard({ title, description, impact = 'medium' }: InsightCardProps) {
  const impactColors = {
    high: 'border-blue',
    medium: 'border-border',
    low: 'border-muted'
  };

  return (
    <div className={`bg-card border-l-4 ${impactColors[impact]} border-t border-r border-b rounded-lg p-5`}>
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="mb-2">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
