import { useState } from 'react';
import { DeviceCard } from '@/components/DeviceCard';
import { ConfigureDeviceDialog } from '@/components/ConfigureDeviceDialog';
import { AddDeviceDialog } from '@/components/AddDeviceDialog';
import { EditDeviceDialog } from '@/components/EditDeviceDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { useGroups } from '@/hooks/useGroups';
import { Device } from '@/types/device';
import { toast } from 'sonner';

const Devices = () => {
  const { devices, loading, sendCommand, updateDevice, createDevice, deleteDevice } = useDevices();
  const { groups } = useGroups();
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [configureDevice, setConfigureDevice] = useState<Device | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDeviceId, setDeleteDeviceId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const unconfiguredDevices = devices.filter(d => d.status === 'unconfigured');
  const configuredDevices = devices.filter(d => d.status !== 'unconfigured');

  const toggleSelected = (id: string, checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

  const filteredDevices = configuredDevices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommand = async (deviceId: string, command: string) => {
    await sendCommand(deviceId, command);
  };

  const handleConfigure = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      setConfigureDevice(device);
      setConfigDialogOpen(true);
    }
  };

  const handleConfigureSubmit = async (deviceId: string, data: { name: string; group?: string }) => {
    await updateDevice(deviceId, {
      name: data.name,
      group: data.group,
      status: 'online', // Change from unconfigured to online
    });
  };

  const handleEdit = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      setEditDevice(device);
      setEditDialogOpen(true);
    }
  };

  const handleEditSubmit = async (deviceId: string, data: Partial<Device>) => {
    await updateDevice(deviceId, data);
  };

  const handleDelete = (deviceId: string) => {
    setDeleteDeviceId(deviceId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteDeviceId) {
      await deleteDevice(deleteDeviceId);
      toast.success('Device deleted successfully');
    }
  };

  const handleAddDevice = () => {
    setAddDialogOpen(true);
  };

  const handleCreateDevice = async (data: { name: string; ipAddress: string }) => {
    await createDevice({
      name: data.name,
      ipAddress: data.ipAddress,
      status: 'unconfigured',
      lastSeen: new Date(),
      wifiConfigured: false,
    });
  };

  const handleBatch = async (command: string) => {
    await Promise.all([...selected].map(id => sendCommand(id, command)));
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

      {unconfiguredDevices.length > 0 && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-5 w-5" />
              Unconfigured Devices ({unconfiguredDevices.length})
            </CardTitle>
            <CardDescription>
              These devices need to be configured before they can be used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {unconfiguredDevices.map(device => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onCommand={handleCommand}
                  onConfigure={handleConfigure}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => handleBatch('play')}>Play Selected</Button>
            <Button size="sm" variant="outline" onClick={() => handleBatch('pause')}>Pause Selected</Button>
            <Button size="sm" variant="secondary" onClick={() => handleBatch('reboot')}>Restart Selected</Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDevices.map(device => (
          <div key={device.id} className="relative">
            <div className="absolute left-2 top-2 z-10">
              <Checkbox
                checked={selected.has(device.id)}
                onCheckedChange={(v) => toggleSelected(device.id, Boolean(v))}
                aria-label={`Select ${device.name}`}
              />
            </div>
            <DeviceCard
              device={device}
              onCommand={handleCommand}
              onConfigure={handleConfigure}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
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

      <ConfigureDeviceDialog
        device={configureDevice}
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        onConfigure={handleConfigureSubmit}
        groups={groups}
      />

      <AddDeviceDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onCreate={handleCreateDevice}
      />

      <EditDeviceDialog
        device={editDevice}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleEditSubmit}
        groups={groups}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Device"
        description="Are you sure you want to delete this device? This action cannot be undone."
      />
    </div>
  );
};

export default Devices;
