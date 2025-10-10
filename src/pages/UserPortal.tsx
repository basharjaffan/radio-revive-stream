import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useDevices } from '@/hooks/useDevices';
import { Play, Pause, RotateCw, Volume2, VolumeX } from 'lucide-react';

const UserPortal = () => {
  const { devices, sendCommand } = useDevices();
  const [volume, setVolume] = useState<number>(50);

  // Automatically select first available device
  const availableDevices = devices.filter(d => d.status !== 'unconfigured');
  const device = availableDevices[0];

  useEffect(() => {
    if (device?.uptime) {
      // Update component when device changes
    }
  }, [device?.id]);

  const handleCommand = async (command: string, params?: any) => {
    if (!device) return;
    await sendCommand(device.id, command, params);
  };

  const handleVolumeChange = async (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (device) {
      await sendCommand(device.id, 'set_volume', { volume: newVolume });
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

  const getSourceText = (source?: 'url' | 'local' | 'none') => {
    switch (source) {
      case 'url': return '🌐 Streaming from URL';
      case 'local': return '💿 Playing local files';
      default: return '⏸️ No source';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Radio Control</h1>
        <p className="text-muted-foreground">Control your music</p>
      </div>

      <div className="grid gap-6">
        {!device ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-lg text-muted-foreground">No devices available</p>
              <p className="text-sm text-muted-foreground mt-2">Please contact administrator</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                {device.name}
              </CardTitle>
              <CardDescription>Control your radio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Device Info */}
              <div className="rounded-lg border bg-muted/50 p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-medium">{formatUptime(device.uptime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-medium">{getSourceText(device.currentSource)}</span>
                </div>
              </div>

            {/* Playback Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                size="lg"
                onClick={() => handleCommand('play')}
                className="h-20"
              >
                <div className="flex flex-col items-center gap-2">
                  <Play className="h-6 w-6" />
                  <span className="text-sm">Play</span>
                </div>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleCommand('pause')}
                className="h-20"
              >
                <div className="flex flex-col items-center gap-2">
                  <Pause className="h-6 w-6" />
                  <span className="text-sm">Pause</span>
                </div>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => handleCommand('reboot')}
                className="h-20"
              >
                <div className="flex flex-col items-center gap-2">
                  <RotateCw className="h-6 w-6" />
                  <span className="text-sm">Restart</span>
                </div>
              </Button>
            </div>

            {/* Volume Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <VolumeX className="h-4 w-4" />
                  Volume
                </span>
                <span className="text-sm font-medium">{volume}%</span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className="h-5 w-5 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
};

export default UserPortal;
