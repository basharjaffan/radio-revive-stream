import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Device } from '@/types/device';
import { DeviceGroup } from '@/types/group';

const configureDeviceSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Device name is required" })
    .max(50, { message: "Device name must be less than 50 characters" })
    .regex(/^[a-zA-Z0-9\s\-_]+$/, { message: "Only letters, numbers, spaces, hyphens and underscores allowed" }),
  group: z.string().optional(),
});

type ConfigureDeviceFormData = z.infer<typeof configureDeviceSchema>;

interface ConfigureDeviceDialogProps {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigure: (deviceId: string, data: { name: string; group?: string }) => Promise<void>;
  groups: DeviceGroup[];
}

export function ConfigureDeviceDialog({
  device,
  open,
  onOpenChange,
  onConfigure,
  groups,
}: ConfigureDeviceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConfigureDeviceFormData>({
    resolver: zodResolver(configureDeviceSchema),
    defaultValues: {
      name: device?.name || '',
      group: device?.group || '',
    },
  });

  const onSubmit = async (data: ConfigureDeviceFormData) => {
    if (!device) return;
    
    setIsSubmitting(true);
    try {
      await onConfigure(device.id, {
        name: data.name,
        group: data.group && data.group !== 'none' ? data.group : undefined,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to configure device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Device</DialogTitle>
          <DialogDescription>
            Set up the device name and assign it to a group.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter device name"
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No group</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Configuring...' : 'Configure'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
