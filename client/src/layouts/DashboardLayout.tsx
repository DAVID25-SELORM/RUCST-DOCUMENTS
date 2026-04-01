import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getDepartmentName } from '../lib/utils';
import { 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  Upload,
  Search,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Close sidebar when route changes (mobile)
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open (mobile)
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Upload', href: '/dashboard/upload', icon: Upload },
    { name: 'Search', href: '/dashboard/search', icon: Search },
    { name: 'Activity', href: '/dashboard/activity', icon: Activity },
    ...((user?.role === 'admin' || user?.role === 'super_admin')
      ? [
          { name: 'Users', href: '/dashboard/users', icon: Users },
          { name: 'Settings', href: '/dashboard/settings', icon: Settings }
        ]
      : []),
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-500 border-b border-blue-700 px-3 sm:px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile logo */}
          <div className="bg-white p-1.5 rounded-lg shadow-md flex-shrink-0">
            <img 
              src="/assets/regent-logo.jpg" 
              alt="Regent University"
              className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
            <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 hidden" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-white text-xs sm:text-sm leading-tight drop-shadow-md truncate">RUCST</span>
            <span className="text-[10px] sm:text-xs text-blue-100 font-medium">DMS</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:bg-white/20 flex-shrink-0"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-200 animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
          role="button"
          aria-label="Close sidebar"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 sm:w-80 lg:w-64 transform bg-white border-r transition-all duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 pt-16 lg:pt-0 shadow-2xl lg:shadow-none overflow-y-auto`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="hidden lg:block p-6 border-b bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600">
            <div className="flex items-center gap-4">
              {/* Regent University Official Logo */}
              <div className="relative flex-shrink-0 group">
                {/* Subtle glow effect */}
                <div className="absolute -inset-0.5 bg-white/30 rounded-xl blur-sm group-hover:blur-md transition duration-300"></div>
                
                <div className="relative bg-white p-2.5 rounded-xl shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src="/assets/regent-logo.jpg" 
                    alt="Regent University Logo"
                    className="h-12 w-12 object-contain"
                    onError={(e) => {
                      // Fallback to icon if logo not available
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg hidden">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-sm text-white leading-tight drop-shadow-md">Regent University<br />College of S&T</h1>
                <p className="text-xs text-blue-100 truncate font-medium mt-1">{getDepartmentName(user?.department || '')}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] active:scale-95 ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            
            {/* Developer Credit */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500 font-medium">
                Developed by
              </p>
              <p className="text-xs text-center font-bold text-blue-600 mt-0.5">
                David Selorm Gabion
              </p>
              <p className="text-xs text-center text-gray-400 mt-0.5">
                © 2026
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-3 sm:p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
