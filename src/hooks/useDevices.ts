import { useState, useEffect } from 'react';
import { Device } from '@/types/device';
import { deviceService } from '@/services/deviceService';
import { toast } from '@/hooks/use-toast';
import { mockDevices } from '@/lib/mockData';

// Use mock data until Firebase is properly configured
const USE_MOCK_DATA = true;

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Use mock data for testing
      setDevices(mockDevices);
      setLoading(false);
      return;
    }

    const unsubscribe = deviceService.subscribeToDevices((updatedDevices) => {
      setDevices(updatedDevices);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createDevice = async (device: Omit<Device, 'id'>) => {
    try {
      if (USE_MOCK_DATA) {
        toast({
          title: "Mock Mode",
          description: "Configure Firebase to enable device creation",
          variant: "destructive",
        });
        return;
      }
      await deviceService.createDevice(device);
      toast({
        title: "Device created",
        description: "Device has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create device",
        variant: "destructive",
      });
    }
  };

  const updateDevice = async (id: string, data: Partial<Device>) => {
    try {
      if (USE_MOCK_DATA) {
        // Update mock data locally
        setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
        toast({
          title: "Device updated",
          description: "Device has been updated (mock mode)",
        });
        return;
      }
      await deviceService.updateDevice(id, data);
      toast({
        title: "Device updated",
        description: "Device has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update device",
        variant: "destructive",
      });
    }
  };

  const deleteDevice = async (id: string) => {
    try {
      if (USE_MOCK_DATA) {
        toast({
          title: "Mock Mode",
          description: "Configure Firebase to enable device deletion",
          variant: "destructive",
        });
        return;
      }
      await deviceService.deleteDevice(id);
      toast({
        title: "Device deleted",
        description: "Device has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete device",
        variant: "destructive",
      });
    }
  };

  const sendCommand = async (deviceId: string, command: string, params?: any) => {
    try {
      if (USE_MOCK_DATA) {
        // Simulate command in mock mode
        if (command === 'play') {
          setDevices((prev) =>
            prev.map((d) => (d.id === deviceId ? { ...d, status: 'playing' as const, lastSeen: new Date() } : d)),
          );
        } else if (command === 'pause') {
          setDevices((prev) =>
            prev.map((d) => (d.id === deviceId ? { ...d, status: 'paused' as const, lastSeen: new Date() } : d)),
          );
        } else if (command === 'set_url' && params?.url) {
          setDevices((prev) =>
            prev.map((d) => (d.id === deviceId ? { ...d, currentUrl: params.url, lastSeen: new Date() } : d)),
          );
        } else if (command === 'reboot') {
          // Briefly set to offline, then back online (or playing if it was)
          let previousStatus: Device['status'] | null = null;
          setDevices((prev) =>
            prev.map((d) => {
              if (d.id === deviceId) {
                previousStatus = d.status;
                return { ...d, status: 'offline' as const, lastSeen: new Date() };
              }
              return d;
            }),
          );
          setTimeout(() => {
            setDevices((prev) =>
              prev.map((d) =>
                d.id === deviceId
                  ? {
                      ...d,
                      status: previousStatus === 'playing' ? 'playing' : 'online',
                      lastSeen: new Date(),
                    }
                  : d,
              ),
            );
          }, 800);
        }
        toast({
          title: "Command sent",
          description: `Command "${command}" sent to device (mock mode)`,
        });
        return;
      }
      await deviceService.sendCommand(deviceId, command, params);
      toast({
        title: "Command sent",
        description: `Command "${command}" sent to device`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send command",
        variant: "destructive",
      });
    }
  };

  return {
    devices,
    loading,
    createDevice,
    updateDevice,
    deleteDevice,
    sendCommand,
  };
};
