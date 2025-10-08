import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FirebaseSetup = () => {
  const steps = [
    {
      title: "1. Skapa Firestore Collections",
      description: "Gå till Firebase Console och skapa collections: devices, users, groups, commands",
      status: "pending",
      link: "https://console.firebase.google.com/project/bashify-f7441/firestore"
    },
    {
      title: "2. Konfigurera Security Rules",
      description: "Kopiera Security Rules från FIREBASE_SETUP.md",
      status: "pending",
      link: "https://console.firebase.google.com/project/bashify-f7441/firestore/rules"
    },
    {
      title: "3. Aktivera Google Sign-In",
      description: "Aktivera Google authentication i Firebase Console",
      status: "pending",
      link: "https://console.firebase.google.com/project/bashify-f7441/authentication/providers"
    },
    {
      title: "4. Lägg till Authorized Domains",
      description: "Lägg till lovableproject.com under authorized domains",
      status: "pending",
      link: "https://console.firebase.google.com/project/bashify-f7441/authentication/settings"
    },
    {
      title: "5. Skapa Initial Data",
      description: "Skapa test-enheter och användare i Firestore",
      status: "pending"
    },
    {
      title: "6. Aktivera Live Data",
      description: "Ändra USE_MOCK_DATA till false i useDevices.ts och useGroups.ts",
      status: "pending"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Firebase Setup</h1>
        <p className="text-muted-foreground">Follow these steps to configure Firebase for Radio Revival</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Currently in Mock Mode</AlertTitle>
        <AlertDescription>
          The app is using mock data. Complete the setup below to connect to Firebase.
          See <code className="bg-muted px-1 py-0.5 rounded">FIREBASE_SETUP.md</code> for detailed instructions.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(step.status)}
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                  <CardDescription>{step.description}</CardDescription>
                </div>
                {step.status === 'pending' && (
                  <Badge variant="outline">Pending</Badge>
                )}
                {step.status === 'completed' && (
                  <Badge variant="default">Completed</Badge>
                )}
              </div>
            </CardHeader>
            {step.link && (
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href={step.link} target="_blank" rel="noopener noreferrer">
                    Open in Firebase Console
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Firebase Configuration</CardTitle>
          <CardDescription>Current Firebase project settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Project ID:</span>
              <p className="font-mono">bashify-f7441</p>
            </div>
            <div>
              <span className="text-muted-foreground">Auth Domain:</span>
              <p className="font-mono">bashify-f7441.firebaseapp.com</p>
            </div>
            <div>
              <span className="text-muted-foreground">Storage Bucket:</span>
              <p className="font-mono">bashify-f7441.firebasestorage.app</p>
            </div>
            <div>
              <span className="text-muted-foreground">App ID:</span>
              <p className="font-mono">1:4459444493:web:654d7e780d94cb6b395844</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Need Help?</AlertTitle>
        <AlertDescription>
          Check <code className="bg-muted px-1 py-0.5 rounded">FIREBASE_SETUP.md</code> for complete documentation 
          including Security Rules, data schemas, and troubleshooting.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FirebaseSetup;
