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
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [streamUrl, setStreamUrl] = useState('');
  const [volume, setVolume] = useState<number>(50);

  const handleDeviceCommand = async (command: string, params?: any) => {
    if (!selectedDevice) return;
    await sendCommand(selectedDevice, command, params);
  };

  const handleGroupCommand = async (command: string, params?: any) => {
    if (!selectedGroup) return;
    await sendGroupCommand(selectedGroup, command, params);
  };

  const handlePlayUrl = async () => {
    if (!streamUrl) return;
    if (selectedDevice) {
      await sendCommand(selectedDevice, 'set_url', { url: streamUrl });
      await sendCommand(selectedDevice, 'play');
    } else if (selectedGroup) {
      await sendGroupCommand(selectedGroup, 'set_url', { url: streamUrl });
      await sendGroupCommand(selectedGroup, 'play');
    }
  };

  const handleVolumeChange = async (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (selectedDevice) {
      await sendCommand(selectedDevice, 'set_volume', { volume: newVolume });
    } else if (selectedGroup) {
      await sendGroupCommand(selectedGroup, 'set_volume', { volume: newVolume });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Radio Control</h1>
        <p className="text-muted-foreground">Choose a device or group to control the music</p>
      </div>

      <div className="grid gap-6">
        {/* Device/Group Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Select Device or Group
            </CardTitle>
            <CardDescription>Choose what you want to control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="device-select">Device</Label>
                <Select 
                  value={selectedDevice} 
                  onValueChange={(value) => {
                    setSelectedDevice(value);
                    setSelectedGroup('');
                  }}
                >
                  <SelectTrigger id="device-select">
                    <SelectValue placeholder="Choose a device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.filter(d => d.status !== 'unconfigured').map(device => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group-select">Group</Label>
                <Select 
                  value={selectedGroup} 
                  onValueChange={(value) => {
                    setSelectedGroup(value);
                    setSelectedDevice('');
                  }}
                >
                  <SelectTrigger id="group-select">
                    <SelectValue placeholder="Choose a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} ({group.deviceIds.length} devices)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playback Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Playback Controls
            </CardTitle>
            <CardDescription>Control music playback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <Button
                size="lg"
                onClick={() => selectedDevice ? handleDeviceCommand('play') : handleGroupCommand('play')}
                disabled={!selectedDevice && !selectedGroup}
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
                onClick={() => selectedDevice ? handleDeviceCommand('pause') : handleGroupCommand('pause')}
                disabled={!selectedDevice && !selectedGroup}
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
                onClick={() => selectedDevice ? handleDeviceCommand('reboot') : handleGroupCommand('reboot')}
                disabled={!selectedDevice && !selectedGroup}
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
                  disabled={!selectedDevice && !selectedGroup}
                />
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stream URL Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Stream URL
            </CardTitle>
            <CardDescription>Enter a stream URL to play</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stream-url">Stream URL</Label>
              <Input
                id="stream-url"
                type="url"
                placeholder="https://example.com/stream.mp3"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
              />
            </div>

            <Button
              onClick={handlePlayUrl}
              disabled={!streamUrl || (!selectedDevice && !selectedGroup)}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Set URL and Play
            </Button>

            {!selectedDevice && !selectedGroup && (
              <p className="text-sm text-muted-foreground text-center">
                Select a device or group first
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserPortal;
