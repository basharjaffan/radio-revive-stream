import { Button } from '@/components/ui/button';
import { Play, Pause, Square, RotateCw } from 'lucide-react';
import { DeviceStatus } from '@/types';

interface MusicPlayerProps {
  status: DeviceStatus;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRestart: () => void;
}

const MusicPlayer = ({ status, onPlay, onPause, onStop, onRestart }: MusicPlayerProps) => {
  const isPlaying = status === 'playing';
  const isPaused = status === 'paused';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Button
          size="lg"
          onClick={onPlay}
          disabled={isPlaying}
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <Play className="h-8 w-8" />
          <span className="text-lg font-semibold">Spela</span>
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={onPause}
          disabled={!isPlaying}
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <Pause className="h-8 w-8" />
          <span className="text-lg font-semibold">Pausa</span>
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onStop}
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <Square className="h-8 w-8" />
          <span className="text-lg font-semibold">Stoppa</span>
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onRestart}
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <RotateCw className="h-8 w-8" />
          <span className="text-lg font-semibold">Starta om</span>
        </Button>
      </div>
    </div>
  );
};

export default MusicPlayer;
