import { useState, useEffect } from 'react';
import { Device } from '@/types/device';
import { deviceService } from '@/services/deviceService';
import { toast } from '@/hooks/use-toast';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = deviceService.subscribeToDevices((updatedDevices) => {
      setDevices(updatedDevices);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createDevice = async (device: Omit<Device, 'id'>) => {
    try {
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
