import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useDevices } from '@/hooks/useDevices';
import { useGroups } from '@/hooks/useGroups';
import { Play, Pause, RotateCw, Volume2, VolumeX, Radio, Users } from 'lucide-react';

const UserPortal = () => {
  const { devices, sendCommand } = useDevices();
  const { groups, sendGroupCommand } = useGroups();
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [volume, setVolume] = useState<number>(50);

  const isGroup = selectedTarget?.startsWith('group-');
  const targetId = selectedTarget?.replace('group-', '');

  const handleCommand = async (command: string, params?: any) => {
    if (!selectedTarget) return;
    
    if (isGroup) {
      await sendGroupCommand(targetId, command, params);
    } else {
      await sendCommand(selectedTarget, command, params);
    }
  };

  const handleVolumeChange = async (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (isGroup) {
      await sendGroupCommand(targetId, 'set_volume', { volume: newVolume });
    } else if (selectedTarget) {
      await sendCommand(selectedTarget, 'set_volume', { volume: newVolume });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Radio Control</h1>
        <p className="text-muted-foreground">Choose a device or group to control the music</p>
      </div>

      <div className="grid gap-6">
        {/* Playback Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Music Control
            </CardTitle>
            <CardDescription>Select and control your music</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target Selection */}
            <div className="space-y-2">
              <Label htmlFor="target-select">Select what to control</Label>
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger id="target-select">
                  <SelectValue placeholder="Choose a device or group" />
                </SelectTrigger>
                <SelectContent>
                  {devices.filter(d => d.status !== 'unconfigured').map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      📻 {device.name}
                    </SelectItem>
                  ))}
                  {groups.length > 0 && devices.filter(d => d.status !== 'unconfigured').length > 0 && (
                    <SelectItem value="separator" disabled>──────────</SelectItem>
                  )}
                  {groups.map(group => (
                    <SelectItem key={group.id} value={`group-${group.id}`}>
                      👥 {group.name} ({group.deviceIds.length} devices)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Playback Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                size="lg"
                onClick={() => handleCommand('play')}
                disabled={!selectedTarget}
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
                disabled={!selectedTarget}
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
                disabled={!selectedTarget}
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
                <Label className="flex items-center gap-2">
                  <VolumeX className="h-4 w-4" />
                  Volume
                </Label>
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
                  disabled={!selectedTarget}
                />
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {!selectedTarget && (
              <p className="text-sm text-muted-foreground text-center">
                Select a device or group to start
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserPortal;
