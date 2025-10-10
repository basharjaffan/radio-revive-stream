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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Device } from '@/types/device';
import { toast } from 'sonner';

const createGroupSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Group name is required" })
    .max(50, { message: "Group name must be less than 50 characters" }),
  deviceIds: z.array(z.string()),
  streamUrl: z.string().url().optional().or(z.literal('')),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { name: string; deviceIds: string[]; streamUrl?: string }) => Promise<void>;
  devices: Device[];
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  onCreate,
  devices,
}: CreateGroupDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      deviceIds: [],
      streamUrl: '',
    },
  });

  const onSubmit = async (data: CreateGroupFormData) => {
    setIsSubmitting(true);
    try {
      await onCreate({
        name: data.name,
        deviceIds: data.deviceIds,
        streamUrl: data.streamUrl || undefined,
      });
      onOpenChange(false);
      form.reset();
      toast.success('Group created successfully');
    } catch (error) {
      toast.error('Failed to create group');
      console.error('Failed to create group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDevices = devices.filter(d => d.status !== 'unconfigured');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Create a group to control multiple devices at once.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Ground Floor"
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
              name="streamUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://stream.example.com/radio.mp3"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Set a default streaming URL for this group
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Select Devices (Optional)</FormLabel>
                    <FormDescription>
                      Choose which devices to include in this group. You can add devices later.
                    </FormDescription>
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-3">
                    {availableDevices.map((device) => (
                    <FormField
                      key={device.id}
                      control={form.control}
                      name="deviceIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={device.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(device.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, device.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== device.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal">
                                {device.name}
                              </FormLabel>
                            </div>
                          </FormItem>
                        )
                      }}
                      />
                    ))}
                  </div>
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
                {isSubmitting ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
