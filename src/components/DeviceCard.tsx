import { Device } from '@/types/device';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceCardProps {
  device: Device;
  onCommand: (deviceId: string, command: string) => void;
  onConfigure: (deviceId: string) => void;
}

const statusConfig = {
  online: { label: 'Online', variant: 'success' as const, icon: Activity },
  offline: { label: 'Offline', variant: 'destructive' as const, icon: Activity },
  unconfigured: { label: 'Unconfigured', variant: 'warning' as const, icon: Settings },
  playing: { label: 'Playing', variant: 'default' as const, icon: Play },
  paused: { label: 'Paused', variant: 'secondary' as const, icon: Pause },
};

export const DeviceCard = ({ device, onCommand, onConfigure }: DeviceCardProps) => {
  const config = statusConfig[device.status];
  const Icon = config.icon;

  const formatLastSeen = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
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

  const getSourceText = (source?: 'url' | 'local' | 'none') => {
    switch (source) {
      case 'url': return '🌐 URL Stream';
      case 'local': return '💿 Local Files';
      default: return '⏸️ None';
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg hover:shadow-primary/20",
      device.status === 'offline' && "opacity-60"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{device.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{device.id}</p>
          </div>
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          {device.ipAddress && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">IP Address:</span>
              <span className="font-mono">{device.ipAddress}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Seen:</span>
            <span>{formatLastSeen(device.lastSeen)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uptime:</span>
            <span className="font-medium">{formatUptime(device.uptime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Source:</span>
            <span className="font-medium">{getSourceText(device.currentSource)}</span>
          </div>
          {device.firmwareVersion && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Firmware:</span>
              <span className="font-mono">{device.firmwareVersion}</span>
            </div>
          )}
          {device.currentUrl && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stream URL:</span>
              <span className="truncate max-w-[150px] text-primary">{device.currentUrl}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {device.status === 'unconfigured' ? (
            <Button 
              onClick={() => onConfigure(device.id)}
              className="w-full"
              variant="default"
            >
              <Settings className="mr-2 h-4 w-4" />
              Configure WiFi
            </Button>
          ) : (
            <>
              <Button
                onClick={() => onCommand(device.id, device.status === 'playing' ? 'pause' : 'play')}
                disabled={device.status === 'offline'}
                className="flex-1"
                variant="default"
              >
                {device.status === 'playing' ? (
                  <><Pause className="mr-2 h-4 w-4" /> Pause</>
                ) : (
                  <><Play className="mr-2 h-4 w-4" /> Play</>
                )}
              </Button>
              <Button
                onClick={() => onConfigure(device.id)}
                disabled={device.status === 'offline'}
                variant="outline"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
