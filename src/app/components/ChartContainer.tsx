import { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ title, children, className = '' }: ChartContainerProps) {
  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <h3 className="mb-4">{title}</h3>
      {children}
    </div>
  );
}
