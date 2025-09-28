import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  FileText, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  User 
} from 'lucide-react';
import { Button } from './ui/button';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Trang chủ' },
    { path: '/insights', icon: BarChart3, label: 'Phân tích' },
    { path: '/therapy', icon: FileText, label: 'Báo cáo' },
    { path: '/recommendations', icon: Lightbulb, label: 'Gợi ý' },
    { path: '/progress', icon: TrendingUp, label: 'Tiến triển' },
    { path: '/alerts', icon: AlertTriangle, label: 'Cảnh báo' },
    { path: '/profile', icon: User, label: 'Hồ sơ' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-slate-900">BioPatch</h1>
                <p className="text-xs text-slate-500">Hệ thống giám sát y sinh</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">Đang kết nối</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start text-left ${
                      isActive 
                        ? 'bg-slate-900 text-white hover:bg-slate-800' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;