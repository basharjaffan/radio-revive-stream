# System Architecture Overview

```
+-------------------+        +------------------+        +--------------------+
| Raspberry Pi Node | <----> |  MQTT Broker     | <----> | Backend (Fastify)  |
|  (rpi-agent)      |        |  (Mosquitto)     |        |                    |
+-------------------+        +------------------+        +--------------------+
         ^                                                     |
         |                                                     v
         +------------------------------------------------> Firebase Firestore
                                                              (organizations/{org}/devices, commands)
                                                              |
                                                              v
                                                       React Frontend
```

## Components

### Raspberry Pi Node (Update Agent)
- Publishes device heartbeats and telemetry to `devices/{deviceId}/status`
- Subscribes to `devices/{deviceId}/commands`
- Periodically checks `/releases/latest` for signed updates (stubbed for future enhancement)
- Runs as a Node.js service or Docker container on each Pi

### MQTT Broker
- Mosquitto/EMQX recommended
- Handles TLS/auth if exposed beyond local network
- Topics follow the `devices/<deviceId>/status` and `devices/<deviceId>/commands` conventions

### Backend Service
- Fastify + Firebase Admin + MQTT client
- Persists status payloads to Firestore
- Watches Firestore `commands` subcollections for `status: pending`, publishes to MQTT, updates state to `sent`
- Provides `/health` and `/config/mqtt` endpoints for observability and bootstrap configuration

### React Frontend
- Uses Firebase SDK to read/write Firestore
- Operators create commands via the UI which writes to `organizations/{orgId}/commands`

## DevOps

- `docker-compose.yml` launches Mosquitto, backend, and optional agent for local integration tests
- `.github/workflows/backend-ci.yml` runs lint + build for backend on every push/PR touching backend files
- Backend and agent Dockerfiles support containerized deployments; use secrets injection for `.env` values
- For production deploys, host the backend on a VM/Container service (e.g., Fly.io, Render) with access to MQTT broker and Firebase

## Future Enhancements

- Implement authentication between backend and broker (username/password or mutual TLS)
- Extend agent to download and install updates (e.g., using signed tarballs)
- Add backend endpoints for device inventory/command history beyond Firestore direct access
- Integrate alerting (PagerDuty/Slack) based on offline status via Firestore triggers or Cloud Functions
