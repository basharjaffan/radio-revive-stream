import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDevices } from '@/hooks/useDevices';
import { useGroups } from '@/hooks/useGroups';
import { Play, Pause, RotateCw, Volume2, Radio, Users } from 'lucide-react';

const UserPortal = () => {
  const { devices, sendCommand } = useDevices();
  const { groups, sendGroupCommand } = useGroups();
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [streamUrl, setStreamUrl] = useState('');

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Radio Control</h1>
        <p className="text-muted-foreground">Choose a device or group to control the music</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Device Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Device Control
            </CardTitle>
            <CardDescription>Control individual devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device-select">Select Device</Label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger id="device-select">
                  <SelectValue placeholder="Choose a device" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name} ({device.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleDeviceCommand('play')}
                disabled={!selectedDevice}
                className="w-full"
              >
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>
              <Button
                onClick={() => handleDeviceCommand('pause')}
                disabled={!selectedDevice}
                variant="outline"
                className="w-full"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            </div>

            <Button
              onClick={() => handleDeviceCommand('reboot')}
              disabled={!selectedDevice}
              variant="secondary"
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Restart Device
            </Button>
          </CardContent>
        </Card>

        {/* Group Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Group Control
            </CardTitle>
            <CardDescription>Control device groups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-select">Select Group</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
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

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleGroupCommand('play')}
                disabled={!selectedGroup}
                className="w-full"
              >
                <Play className="mr-2 h-4 w-4" />
                Play All
              </Button>
              <Button
                onClick={() => handleGroupCommand('pause')}
                disabled={!selectedGroup}
                variant="outline"
                className="w-full"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause All
              </Button>
            </div>

            <Button
              onClick={() => handleGroupCommand('reboot')}
              disabled={!selectedGroup}
              variant="secondary"
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Restart All Devices
            </Button>
          </CardContent>
        </Card>

        {/* Stream URL Control */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Stream Control
            </CardTitle>
            <CardDescription>Set and play a stream URL</CardDescription>
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
            >
              <Play className="mr-2 h-4 w-4" />
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
