export interface DeviceGroup {
  id: string;
  name: string;
  deviceIds: string[];
  createdAt: Date;
  streamUrl?: string;
}
