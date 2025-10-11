export type DeviceStatus = 'online' | 'offline' | 'unconfigured' | 'playing' | 'paused';

export type DeviceCommandName = 'play' | 'pause' | 'stop' | 'set_url' | 'set_volume' | 'reboot';

export type CommandParameters = {
  url?: string;
  volume?: number;
  [key: string]: unknown;
};

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
  uptime?: number; // in seconds
  currentSource?: 'url' | 'local' | 'none';
}

export interface DeviceCommand {
  deviceId: string;
  command: DeviceCommandName;
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
