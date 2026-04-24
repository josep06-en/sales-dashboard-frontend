import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Calendar, Check, ChevronDown } from 'lucide-react';

const DATE_RANGES = [
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'Last 6 months',
  'Last 12 months',
  'Year to date',
  'All time'
];

export function Navbar() {
  const location = useLocation();
  const [selectedRange, setSelectedRange] = useState('Last 30 days');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/metrics', label: 'Metrics' },
    { path: '/insights', label: 'Insights' },
    { path: '/alerts', label: 'Alerts' },
    { path: '/analysis', label: 'Analysis' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl">Sales Analytics – Brazil</h1>
            <div className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={open}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md cursor-pointer hover:bg-accent transition-colors"
            >
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{selectedRange}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <ul
                role="listbox"
                className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-md py-1 z-50"
              >
                {DATE_RANGES.map((range) => {
                  const isSelected = range === selectedRange;
                  return (
                    <li key={range}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedRange(range);
                          setOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-accent transition-colors ${
                          isSelected ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <span>{range}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
