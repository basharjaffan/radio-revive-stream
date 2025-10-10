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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const addDeviceSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Device name is required" })
    .max(50, { message: "Device name must be less than 50 characters" }),
  ipAddress: z.string()
    .trim()
    .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, { message: "Invalid IP address" }),
});

type AddDeviceFormData = z.infer<typeof addDeviceSchema>;

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: AddDeviceFormData) => Promise<void>;
}

export function AddDeviceDialog({
  open,
  onOpenChange,
  onCreate,
}: AddDeviceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddDeviceFormData>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      name: '',
      ipAddress: '',
    },
  });

  const onSubmit = async (data: AddDeviceFormData) => {
    setIsSubmitting(true);
    try {
      await onCreate(data);
      onOpenChange(false);
      form.reset();
      toast.success('Device added successfully');
    } catch (error) {
      toast.error('Failed to add device');
      console.error('Failed to add device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
          <DialogDescription>
            Add a new radio device to the system.
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
                      placeholder="e.g. Kitchen Radio"
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
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 192.168.1.100"
                      {...field}
                    />
                  </FormControl>
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
                {isSubmitting ? 'Adding...' : 'Add Device'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
