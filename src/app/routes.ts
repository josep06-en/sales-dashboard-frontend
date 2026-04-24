import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { Metrics } from './pages/Metrics';
import { Insights } from './pages/Insights';
import { Alerts } from './pages/Alerts';
import { Analysis } from './pages/Analysis';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Overview },
      { path: 'metrics', Component: Metrics },
      { path: 'insights', Component: Insights },
      { path: 'alerts', Component: Alerts },
      { path: 'analysis', Component: Analysis }
    ]
  }
]);
