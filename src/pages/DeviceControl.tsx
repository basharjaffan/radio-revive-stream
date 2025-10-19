import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/context/UserAuthContext';
import { devicesApi, commandsApi } from '@/services/firebase-api';
import { Device } from '@/types';
import MusicPlayer from '@/components/MusicPlayer';
import DeviceStatus from '@/components/DeviceStatus';
import VolumeControl from '@/components/VolumeControl';
import { toast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

const DeviceControl = () => {
  const { user, deviceId, signOut } = useUserAuth();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [volume, setVolume] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !deviceId) {
      navigate('/login');
      return;
    }

    // Lyssna på enhetens status i realtid
    const unsubscribe = devicesApi.subscribeToDevice(deviceId, (updatedDevice) => {
      setDevice(updatedDevice);
      if (updatedDevice?.volume !== undefined) {
        setVolume(updatedDevice.volume);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, deviceId, navigate]);

  const handleCommand = async (command: 'play' | 'pause' | 'stop' | 'restart') => {
    if (!deviceId) return;

    try {
      await commandsApi.send(deviceId, command, device?.currentUrl);
      toast({
        title: "Kommando skickat",
        description: `${command} har skickats till enheten`,
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte skicka kommando",
        variant: "destructive",
      });
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    if (!deviceId) return;
    setVolume(newVolume);

    try {
      await commandsApi.send(deviceId, 'volume', undefined, newVolume);
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ändra volym",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Laddar enhet...</p>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Ingen enhet hittades</p>
          <Button onClick={handleSignOut}>Logga ut</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Musikportal</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Logga ut
          </Button>
        </div>

        <DeviceStatus device={device} />

        <MusicPlayer
          status={device.status}
          onPlay={() => handleCommand('play')}
          onPause={() => handleCommand('pause')}
          onStop={() => handleCommand('stop')}
          onRestart={() => handleCommand('restart')}
        />

        <VolumeControl volume={volume} onChange={handleVolumeChange} />
      </div>
    </div>
  );
};

export default DeviceControl;
