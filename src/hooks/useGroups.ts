import { useState, useEffect } from 'react';
import { DeviceGroup } from '@/types/group';
import { groupService } from '@/services/groupService';
import { toast } from '@/hooks/use-toast';
import { mockGroups } from '@/lib/mockData';

// Use mock data until Firebase is properly configured
const USE_MOCK_DATA = false;

export const useGroups = () => {
  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Use mock data for testing
      setGroups(mockGroups);
      setLoading(false);
      return;
    }

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
      if (USE_MOCK_DATA) {
        // Mock mode: add locally
        const newGroup = {
          ...group,
          id: `group-${Date.now()}`,
        };
        setGroups(prev => [...prev, newGroup]);
        toast({
          title: "Group created",
          description: "Group has been created successfully (mock mode)",
        });
        return;
      }
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
      if (USE_MOCK_DATA) {
        // Mock mode: update locally
        setGroups(prev => prev.map(g => 
          g.id === id ? { ...g, ...data } : g
        ));
        toast({
          title: "Group updated",
          description: "Group has been updated successfully (mock mode)",
        });
        return;
      }
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
      if (USE_MOCK_DATA) {
        // Mock mode: delete locally
        setGroups(prev => prev.filter(g => g.id !== id));
        toast({
          title: "Group deleted",
          description: "Group has been deleted successfully (mock mode)",
        });
        return;
      }
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
      if (USE_MOCK_DATA) {
        toast({
          title: "Command sent",
          description: `Command "${command}" sent to all devices in group (mock mode)`,
        });
        return;
      }
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
