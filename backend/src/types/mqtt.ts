export interface DeviceStatusPayload {
  deviceId: string;
  organizationId: string;
  online: boolean;
  battery?: number;
  firmwareVersion?: string;
  reportedAt: string;
  metadata?: Record<string, unknown>;
}

export interface DeviceCommandPayload {
  commandId: string;
  organizationId: string;
  deviceId: string;
  name: string;
  params?: Record<string, unknown>;
  createdAt: string;
}

export type DeviceStatusHandler = (payload: DeviceStatusPayload) => Promise<void>;
