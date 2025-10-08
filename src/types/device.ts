export type DeviceStatus = 'online' | 'offline' | 'unconfigured' | 'playing' | 'paused';

export interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  lastSeen: Date;
  ipAddress?: string;
  wifiConfigured: boolean;
  currentUrl?: string;
  firmwareVersion?: string;
  group?: string;
}

export interface DeviceCommand {
  deviceId: string;
  command: 'play' | 'pause' | 'stop' | 'set_url';
  url?: string;
  timestamp: Date;
}

export interface DeviceLog {
  id: string;
  deviceId: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
}
