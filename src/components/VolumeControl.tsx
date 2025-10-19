import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

const VolumeControl = ({ volume, onChange }: VolumeControlProps) => {
  const handleVolumeChange = (value: number[]) => {
    onChange(value[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Volym
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{volume}%</span>
          </div>
          <div className="flex items-center gap-4">
            <VolumeX className="h-5 w-5 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={5}
              className="flex-1"
            />
            <Volume2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VolumeControl;
