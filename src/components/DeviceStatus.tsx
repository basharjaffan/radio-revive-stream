import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Device } from '@/types';
import { Wifi, WifiOff, Music, Pause as PauseIcon, Square } from 'lucide-react';

interface DeviceStatusProps {
  device: Device;
}

const DeviceStatus = ({ device }: DeviceStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-success text-success-foreground';
      case 'offline':
        return 'bg-destructive text-destructive-foreground';
      case 'playing':
        return 'bg-primary text-primary-foreground';
      case 'paused':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4" />;
      case 'offline':
        return <WifiOff className="h-4 w-4" />;
      case 'playing':
        return <Music className="h-4 w-4" />;
      case 'paused':
        return <PauseIcon className="h-4 w-4" />;
      case 'stopped':
        return <Square className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{device.name}</span>
          <Badge className={getStatusColor(device.status)}>
            <span className="flex items-center gap-2">
              {getStatusIcon(device.status)}
              {device.status}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">IP-adress:</span>
            <p className="font-medium">{device.ipAddress || 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Uptime:</span>
            <p className="font-medium">{formatUptime(device.uptime)}</p>
          </div>
        </div>
        
        {device.currentUrl && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground block mb-1">Spelar nu:</span>
            <p className="text-sm font-medium truncate">{device.currentUrl}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceStatus;
