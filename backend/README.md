# Radio Revive Backend

A Fastify-based Node.js service that bridges MQTT-connected devices with Firebase Firestore.

## Features

- Connects to Mosquitto/EMQX over MQTT using the `mqtt` package
- Persists device heartbeats to Firestore
- Watches the `commands` sub-collections for `status: "pending"` documents and publishes them back to devices
- Exposes `/health` and `/config/mqtt` endpoints for monitoring and device bootstrap

## Getting started

```sh
cd backend
npm install
cp .env.example .env # Fill in Firebase + MQTT settings
npm run dev
```

## Environment variables

See [`.env.example`](./.env.example) for the full list. You will need a Firebase service account JSON with Firestore access and network connectivity to the MQTT broker.

## Production build

```sh
npm run build
npm start
```

Or build using Docker:

```sh
docker build -t radio-revive-backend .
```
