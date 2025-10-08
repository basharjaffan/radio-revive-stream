import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Radio, Boxes, Users, Settings, Activity, FileText } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Activity },
  { name: 'Devices', href: '/devices', icon: Radio },
  { name: 'Groups', href: '/groups', icon: Boxes },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Logs', href: '/logs', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Radio className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">Radio Revival</h1>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@radiorevival.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
