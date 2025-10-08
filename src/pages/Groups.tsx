import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Radio, Calendar, RotateCw } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { useDevices } from '@/hooks/useDevices';

const Groups = () => {
  const { groups, loading } = useGroups();
  const { devices, sendCommand } = useDevices();

  const handleAddGroup = () => {
    // TODO: Open add group modal
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
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
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
    </div>
  );
};

export default Groups;
