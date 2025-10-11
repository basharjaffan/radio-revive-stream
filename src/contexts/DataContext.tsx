import { createContext, useContext, ReactNode } from 'react';
import { CommandParameters, Device, DeviceCommandName } from '@/types/device';
import { DeviceGroup } from '@/types/group';
import { User } from '@/types/user';
import { useDevices } from '@/hooks/useDevices';
import { useGroups } from '@/hooks/useGroups';
import { useUsers } from '@/hooks/useUsers';

interface DataContextType {
  // Devices
  devices: Device[];
  devicesLoading: boolean;
  createDevice: (device: Omit<Device, 'id'>) => Promise<void>;
  updateDevice: (id: string, data: Partial<Device>) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  sendCommand: (
    deviceId: string,
    command: DeviceCommandName,
    params?: CommandParameters,
  ) => Promise<void>;
  
  // Groups
  groups: DeviceGroup[];
  groupsLoading: boolean;
  createGroup: (group: Omit<DeviceGroup, 'id'>) => Promise<void>;
  updateGroup: (id: string, data: Partial<DeviceGroup>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  sendGroupCommand: (
    groupId: string,
    command: DeviceCommandName,
    params?: CommandParameters,
  ) => Promise<void>;
  
  // Users
  users: User[];
  usersLoading: boolean;
  deleteUser: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Load all data once at the top level
  const {
    devices,
    loading: devicesLoading,
    createDevice,
    updateDevice,
    deleteDevice,
    sendCommand,
  } = useDevices();

  const {
    groups,
    loading: groupsLoading,
    createGroup,
    updateGroup,
    deleteGroup,
    sendGroupCommand,
  } = useGroups();

  const {
    users,
    loading: usersLoading,
    deleteUser,
    updateUser,
  } = useUsers();

  return (
    <DataContext.Provider
      value={{
        devices,
        devicesLoading,
        createDevice,
        updateDevice,
        deleteDevice,
        sendCommand,
        groups,
        groupsLoading,
        createGroup,
        updateGroup,
        deleteGroup,
        sendGroupCommand,
        users,
        usersLoading,
        deleteUser,
        updateUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
