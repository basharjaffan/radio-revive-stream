import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { toast } from '@/hooks/use-toast';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      await loadUsers();
      toast({ title: 'User deleted', description: 'User has been removed' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      await userService.updateUser(id, data);
      await loadUsers();
      toast({ title: 'User updated', description: 'User has been updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
    }
  };

  return { users, loading, deleteUser, updateUser };
};
