export type DeviceStatus = 'online' | 'offline' | 'playing' | 'paused' | 'stopped';

export interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  lastSeen: Date;
  ipAddress?: string;
  currentUrl?: string;
  uptime?: number; // in seconds
  volume?: number; // 0-100
  userId?: string; // Koppla enhet till användare
}

export interface User {
  id: string;
  email: string;
  deviceId?: string; // Användare kan ha en kopplad enhet
}
