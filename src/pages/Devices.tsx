import { useState } from 'react';
import { DeviceCard } from '@/components/DeviceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';

const Devices = () => {
  const { devices, loading, sendCommand } = useDevices();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommand = async (deviceId: string, command: string) => {
    await sendCommand(deviceId, command);
  };

  const handleConfigure = (deviceId: string) => {
    // TODO: Open configuration modal/dialog
  };

  const handleAddDevice = () => {
    // TODO: Open add device modal/dialog
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading devices...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
          <p className="text-muted-foreground">Manage your radio devices</p>
        </div>
        <Button onClick={handleAddDevice}>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDevices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onCommand={handleCommand}
            onConfigure={handleConfigure}
          />
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No devices found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or add a new device
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
