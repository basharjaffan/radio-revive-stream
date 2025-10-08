import { useState } from 'react';
import { mockLogs } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Logs = () => {
  const [logs] = useState(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.deviceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
        <p className="text-muted-foreground">System activity and device logs</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map(log => (
              <div key={log.id} className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                <Badge 
                  variant={
                    log.level === 'error' ? 'destructive' : 
                    log.level === 'warning' ? 'warning' : 
                    'secondary'
                  }
                  className="mt-1"
                >
                  {log.level}
                </Badge>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">{log.message}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">{log.deviceId}</span>
                    <span>•</span>
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredLogs.length === 0 && (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No logs found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
