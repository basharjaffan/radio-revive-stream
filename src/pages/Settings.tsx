import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Settings = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure system settings and preferences</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>MQTT Configuration</CardTitle>
            <CardDescription>Configure connection to MQTT broker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mqtt-host">MQTT Broker Host</Label>
              <Input id="mqtt-host" placeholder="mqtt.example.com" defaultValue="localhost" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mqtt-port">Port</Label>
              <Input id="mqtt-port" type="number" placeholder="1883" defaultValue="1883" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mqtt-username">Username</Label>
              <Input id="mqtt-username" placeholder="mqtt_user" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mqtt-password">Password</Label>
              <Input id="mqtt-password" type="password" placeholder="••••••••" />
            </div>
            <Button onClick={handleSave}>Save MQTT Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Google SSO</CardTitle>
            <CardDescription>Configure Google OAuth authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="google-client-id">Client ID</Label>
              <Input id="google-client-id" placeholder="your-client-id.apps.googleusercontent.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google-client-secret">Client Secret</Label>
              <Input id="google-client-secret" type="password" placeholder="••••••••" />
            </div>
            <Button onClick={handleSave}>Save OAuth Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>General system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="healthcheck-interval">Healthcheck Interval (seconds)</Label>
              <Input id="healthcheck-interval" type="number" placeholder="60" defaultValue="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="log-retention">Log Retention (days)</Label>
              <Input id="log-retention" type="number" placeholder="30" defaultValue="30" />
            </div>
            <Button onClick={handleSave}>Save System Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
