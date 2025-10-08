import { useState, useEffect } from 'react';
import { DeviceGroup } from '@/types/group';
import { groupService } from '@/services/groupService';
import { toast } from '@/hooks/use-toast';

export const useGroups = () => {
  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (group: Omit<DeviceGroup, 'id'>) => {
    try {
      await groupService.createGroup(group);
      await loadGroups();
      toast({
        title: "Group created",
        description: "Group has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    }
  };

  const updateGroup = async (id: string, data: Partial<DeviceGroup>) => {
    try {
      await groupService.updateGroup(id, data);
      await loadGroups();
      toast({
        title: "Group updated",
        description: "Group has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update group",
        variant: "destructive",
      });
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      await groupService.deleteGroup(id);
      await loadGroups();
      toast({
        title: "Group deleted",
        description: "Group has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    }
  };

  const sendGroupCommand = async (groupId: string, command: string, params?: any) => {
    try {
      await groupService.sendGroupCommand(groupId, command, params);
      toast({
        title: "Command sent",
        description: `Command "${command}" sent to all devices in group`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send command to group",
        variant: "destructive",
      });
    }
  };

  return {
    groups,
    loading,
    createGroup,
    updateGroup,
    deleteGroup,
    sendGroupCommand,
  };
};
