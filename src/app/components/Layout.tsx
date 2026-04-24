import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
