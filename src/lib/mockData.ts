import { Device, DeviceLog } from '@/types/device';
import { User } from '@/types/user';
import { DeviceGroup } from '@/types/group';

export const mockDevices: Device[] = [
  {
    id: 'rpi-001',
    name: 'Reception Radio',
    status: 'playing',
    lastSeen: new Date(),
    ipAddress: '192.168.1.101',
    wifiConfigured: true,
    currentUrl: 'https://stream.example.com/jazz',
    firmwareVersion: '1.2.3',
    group: 'group-1',
  },
  {
    id: 'rpi-002',
    name: 'Kitchen Speaker',
    status: 'online',
    lastSeen: new Date(Date.now() - 120000),
    ipAddress: '192.168.1.102',
    wifiConfigured: true,
    firmwareVersion: '1.2.3',
    group: 'group-1',
  },
  {
    id: 'rpi-003',
    name: 'Office Radio',
    status: 'unconfigured',
    lastSeen: new Date(Date.now() - 300000),
    wifiConfigured: false,
    firmwareVersion: '1.2.2',
  },
  {
    id: 'rpi-004',
    name: 'Lounge Speaker',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000),
    ipAddress: '192.168.1.104',
    wifiConfigured: true,
    firmwareVersion: '1.2.3',
    group: 'group-2',
  },
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@radiorevival.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
  },
  {
    id: 'user-2',
    email: 'operator@radiorevival.com',
    name: 'Radio Operator',
    role: 'user',
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date(Date.now() - 86400000),
  },
];

export const mockGroups: DeviceGroup[] = [
  {
    id: 'group-1',
    name: 'Ground Floor',
    deviceIds: ['rpi-001', 'rpi-002'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'group-2',
    name: 'Upper Floor',
    deviceIds: ['rpi-004'],
    createdAt: new Date('2024-02-01'),
  },
];

export const mockLogs: DeviceLog[] = [
  {
    id: 'log-1',
    deviceId: 'rpi-001',
    timestamp: new Date(),
    level: 'info',
    message: 'Stream started successfully',
  },
  {
    id: 'log-2',
    deviceId: 'rpi-001',
    timestamp: new Date(Date.now() - 60000),
    level: 'info',
    message: 'MQTT connection established',
  },
  {
    id: 'log-3',
    deviceId: 'rpi-003',
    timestamp: new Date(Date.now() - 120000),
    level: 'warning',
    message: 'WiFi configuration missing',
  },
  {
    id: 'log-4',
    deviceId: 'rpi-004',
    timestamp: new Date(Date.now() - 3600000),
    level: 'error',
    message: 'Connection timeout',
  },
];
