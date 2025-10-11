# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/dc8295f4-1289-4e7f-bb79-233a61d21d7c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/dc8295f4-1289-4e7f-bb79-233a61d21d7c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Firebase (Firestore & Auth)

## Backend, device fleet and database architecture

The repository now ships with an opinionated reference backend in the [`backend/`](backend/) directory that bridges MQTT-connected Raspberry Pis with Firebase. The high-level flow is:

1. **Raspberry Pi update agent** (see [`rpi-agent/`](rpi-agent/)) publishes status heartbeats and listens for commands via MQTT.
2. **MQTT broker** (Mosquitto/EMQX) relays traffic between the devices and backend.
3. **Backend service** connects to the broker, persists device status to Firestore, and relays pending commands back to devices.
4. **React frontend** reads from Firestore via Firebase SDKs and allows operators to queue commands, which the backend observes and forwards to devices.

The backend is built with Fastify, Firebase Admin and the `mqtt` client. Environment variables are documented in [`backend/.env.example`](backend/.env.example). Running `npm install` followed by `npm run dev` inside the `backend` directory will start a local development server that exposes `/health` and `/config/mqtt` endpoints while streaming MQTT messages to/from Firestore.

### Firebase data shape

The backend and frontend expect a Firestore hierarchy similar to:

```
organizations/{organizationId}
  devices/{deviceId}
  commands/{commandId}
```

- Devices publish heartbeats on `devices/{deviceId}/status` topics with payloads matching `DeviceStatusPayload`.
- Commands are written to `organizations/{orgId}/commands` with `status: "pending"`; the backend publishes them to MQTT and marks them as `sent` or `failed`.

Update [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md) with project-specific collection rules when provisioning your Firebase project.

See [`docs/architecture.md`](docs/architecture.md) for a full picture of how the Raspberry Pi agents, MQTT broker, backend and frontend communicate.

## How can I deploy this project?

For frontend-only deployments you can still open [Lovable](https://lovable.dev/projects/dc8295f4-1289-4e7f-bb79-233a61d21d7c) and click on Share -> Publish.

To run the complete stack locally (frontend, backend, MQTT and a sample agent) you can use Docker Compose:

```sh
docker compose up --build
```

This starts Mosquitto on `1883`, the backend on `4000`, and an optional Raspberry Pi agent container (scale it up via `docker compose up --scale rpi-agent=2`). Provide real secrets by copying `.env.example` files to `.env` before launching.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
