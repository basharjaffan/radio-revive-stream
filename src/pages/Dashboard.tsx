import { useState } from 'react';
import { DeviceCard } from '@/components/DeviceCard';
import { StatsCard } from '@/components/StatsCard';
import { mockLogs } from '@/lib/mockData';
import { Radio, Activity, AlertTriangle, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDevices } from '@/hooks/useDevices';

const Dashboard = () => {
  const { devices, loading, sendCommand } = useDevices();
  const [logs] = useState(mockLogs.slice(0, 5));

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online' || d.status === 'playing').length,
    playing: devices.filter(d => d.status === 'playing').length,
    unconfigured: devices.filter(d => d.status === 'unconfigured').length,
  };

  const handleCommand = async (deviceId: string, command: string) => {
    await sendCommand(deviceId, command);
  };

  const handleConfigure = (deviceId: string) => {
    // TODO: Open configuration modal
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('sv-SE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">System overview and device status</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Devices"
          value={stats.total}
          description="Registered in system"
          icon={Radio}
        />
        <StatsCard
          title="Online Devices"
          value={stats.online}
          description={`${Math.round((stats.online / stats.total) * 100)}% uptime`}
          icon={Activity}
        />
        <StatsCard
          title="Currently Playing"
          value={stats.playing}
          description="Active streams"
          icon={PlayCircle}
        />
        <StatsCard
          title="Needs Config"
          value={stats.unconfigured}
          description="Requires setup"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Devices</h2>
          <div className="grid gap-4">
            {devices.slice(0, 4).map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onCommand={handleCommand}
                onConfigure={handleConfigure}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Logs</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <Badge 
                      variant={
                        log.level === 'error' ? 'destructive' : 
                        log.level === 'warning' ? 'warning' : 
                        'secondary'
                      }
                      className="mt-0.5"
                    >
                      {log.level}
                    </Badge>
                    <div className="flex-1 space-y-1">
                      <p className="text-foreground">{log.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{log.deviceId}</span>
                        <span>•</span>
                        <span>{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
