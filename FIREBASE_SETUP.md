# Firebase Setup Guide

## 1. Skapa Firestore Collections

Gå till Firebase Console → Firestore Database → Start collection

> **Ny struktur:** Backenden förlitar sig på att alla enheter och kommandon ligger under `organizations/{organizationId}`. Börja därför med att skapa en `organizations` collection och lägg dina befintliga samlingar som undersamlingar.

### Collection: `organizations`
Skapa ett organisationdokument och lägg till en undersamling `devices`:

```json
{
  "name": "Demo Organization",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Subcollection: `devices`
Skapa första dokumentet med denna struktur:
```json
{
  "name": "Test Device",
  "status": "online",
  "lastSeen": "2024-01-15T10:30:00Z",
  "ipAddress": "192.168.1.100",
  "wifiConfigured": true,
  "currentUrl": "https://stream.example.com/radio",
  "firmwareVersion": "1.0.0",
  "group": "group-1"
}
```

### Collection: `users`
```json
{
  "email": "admin@radiorevival.com",
  "name": "Admin User",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLogin": "2024-01-15T10:00:00Z"
}
```

### Collection: `groups`
```json
{
  "name": "Ground Floor",
  "deviceIds": ["device-id-1", "device-id-2"],
  "createdAt": "2024-01-15T00:00:00Z"
}
```

### Subcollection: `commands`
Under respektive organisation, skapa en undersamling `commands`:
```json
{
  "deviceId": "device-id-1",
  "command": "play",
  "params": {},
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "pending"
}
```

## 2. Firestore Security Rules

Gå till Firebase Console → Firestore Database → Rules

Kopiera denna kod:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Admins can read/write all users
      // Users can read their own data
      allow read: if isSignedIn();
      allow create: if isAdmin();
      allow update: if isAdmin() || isOwner(userId);
      allow delete: if isAdmin();
    }
    
    // Organizations collection
    match /organizations/{orgId} {
      allow read: if isSignedIn();
      allow create: if isAdmin();
      allow update, delete: if isAdmin();

      // Devices subcollection
      match /devices/{deviceId} {
        // Validate device data
        function validDevice() {
          let data = request.resource.data;
          return data.name is string && data.name.size() > 0 && data.name.size() <= 100 &&
                 data.status in ['online', 'offline', 'unconfigured', 'playing', 'paused'] &&
                 data.wifiConfigured is bool &&
                 (data.firmwareVersion == null || (data.firmwareVersion is string && data.firmwareVersion.size() <= 20)) &&
                 (data.ipAddress == null || (data.ipAddress is string && data.ipAddress.size() <= 45)) &&
                 (data.currentUrl == null || (data.currentUrl is string && data.currentUrl.size() <= 500));
        }

        allow read: if isSignedIn();
        allow create: if isAdmin() && validDevice();
        allow update: if isAdmin() && validDevice();
        allow delete: if isAdmin();
      }

      // Commands subcollection
      match /commands/{commandId} {
        function validCommand() {
          let data = request.resource.data;
          return data.command is string && data.command.size() > 0 && data.command.size() <= 50 &&
                 data.status in ['pending', 'sent', 'completed', 'failed'] &&
                 (data.deviceId is string || data.groupId is string);
        }

        allow read: if isSignedIn();
        allow create: if isSignedIn() && validCommand();
        allow update: if isAdmin();
        allow delete: if isAdmin();
      }
    }

    // Groups collection
    match /groups/{groupId} {
      function validGroup() {
        let data = request.resource.data;
        return data.name is string && data.name.size() > 0 && data.name.size() <= 100 &&
               data.deviceIds is list && data.deviceIds.size() <= 50;
      }

      allow read: if isSignedIn();
      allow create: if isAdmin() && validGroup();
      allow update: if isAdmin() && validGroup();
      allow delete: if isAdmin();
    }
  }
}
```

## 3. Aktivera Google Sign-In

1. Gå till Firebase Console → Authentication → Sign-in method
2. Klicka på "Google"
3. Aktivera switchen
4. Lägg till din email som "Project support email"
5. Spara

## 4. Lägg till Authorized Domains

Under Authentication → Settings → Authorized domains:
- Lägg till: `lovableproject.com`
- Lägg till din egen domän när du deployer

## 5. Aktivera Firebase i Appen

När allt är klart, uppdatera dessa filer:

### `src/hooks/useDevices.ts`
```typescript
// Ändra från:
const USE_MOCK_DATA = true;

// Till:
const USE_MOCK_DATA = false;
```

### `src/hooks/useGroups.ts`
```typescript
// Ändra från:
const USE_MOCK_DATA = true;

// Till:
const USE_MOCK_DATA = false;
```

## 6. Testa Autentisering

1. Gå till appen
2. Logga in med Google (kräver att Authentication är aktiverat)
3. Efter inloggning ska du kunna se data från Firestore

## 7. Skapa Initial Admin User

Efter första inloggningen med Google:

1. Gå till Firestore Console
2. Öppna `users` collection
3. Hitta ditt auto-skapade användardokument (ID = din Firebase Auth UID)
4. Lägg till fältet: `role: "admin"`
5. Nu har du admin-rättigheter!

## Felsökning

### "Permission denied" fel
- Kontrollera att Security Rules är korrekt deployade
- Kontrollera att användaren är inloggad
- Kontrollera att användaren har rätt roll (admin)

### "Network error" 
- Kontrollera att Firebase config i `src/lib/firebase.ts` är korrekt
- Kontrollera att Firestore är aktiverat i Firebase Console

### Google Sign-In funkar inte
- Kontrollera att domänen är authorized i Firebase Console
- Kontrollera att Google Sign-In är aktiverat
- Kontrollera browser console för felmeddelanden
