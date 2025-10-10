import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateGroupDialog } from '@/components/CreateGroupDialog';
import { EditGroupDialog } from '@/components/EditGroupDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Plus, Radio, Calendar, MoreVertical, Pencil, Trash2, Link as LinkIcon } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { useDevices } from '@/hooks/useDevices';
import { DeviceGroup } from '@/types/group';

const Groups = () => {
  const { groups, loading, createGroup, updateGroup, deleteGroup } = useGroups();
  const { devices, sendCommand } = useDevices();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<DeviceGroup | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAddGroup = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateGroup = async (data: { name: string; deviceIds: string[]; streamUrl?: string }) => {
    await createGroup({
      name: data.name,
      deviceIds: data.deviceIds,
      streamUrl: data.streamUrl,
      createdAt: new Date(),
    });
  };

  const handleEdit = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setEditGroup(group);
      setEditDialogOpen(true);
    }
  };

  const handleEditSubmit = async (groupId: string, data: Partial<DeviceGroup>) => {
    await updateGroup(groupId, data);
  };

  const handleDelete = (groupId: string) => {
    setDeleteGroupId(groupId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteGroupId) {
      await deleteGroup(deleteGroupId);
    }
  };

  const handleGroupCommand = async (groupId: string, command: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    await Promise.all(group.deviceIds.map(id => sendCommand(id, command)));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading groups...</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getDeviceNames = (deviceIds: string[]) => {
    return deviceIds
      .map(id => devices.find(d => d.id === id)?.name || id)
      .join(', ');
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">Organize devices into groups for batch control</p>
        </div>
        <Button onClick={handleAddGroup}>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map(group => (
          <Card key={group.id} className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge variant="secondary">
                    {group.deviceIds.length} {group.deviceIds.length === 1 ? 'device' : 'devices'}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(group.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(group.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {group.streamUrl && (
                  <div className="flex items-start gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Stream URL:</p>
                      <p className="text-foreground mt-1 truncate text-primary">{group.streamUrl}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2 text-sm">
                  <Radio className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Devices:</p>
                    <p className="text-foreground mt-1">{getDeviceNames(group.deviceIds)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Created {formatDate(group.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleGroupCommand(group.id, 'play')}
                  className="flex-1"
                  variant="default"
                  size="sm"
                >
                  Play All
                </Button>
                <Button
                  onClick={() => handleGroupCommand(group.id, 'pause')}
                  className="flex-1"
                  variant="outline"
                  size="sm"
                >
                  Pause All
                </Button>
                <Button
                  onClick={() => handleGroupCommand(group.id, 'reboot')}
                  className="flex-1"
                  variant="secondary"
                  size="sm"
                >
                  Restart All
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No groups yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Create a group to control multiple devices at once
            </p>
            <Button onClick={handleAddGroup} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Group
            </Button>
          </div>
        </div>
      )}

      <CreateGroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateGroup}
        devices={devices}
      />

      <EditGroupDialog
        group={editGroup}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleEditSubmit}
        devices={devices}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Group"
        description="Are you sure you want to delete this group? This action cannot be undone."
      />
    </div>
  );
};

export default Groups;
