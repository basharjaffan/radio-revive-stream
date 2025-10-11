# Raspberry Pi Update Agent

A lightweight Node.js process that runs on each Raspberry Pi to publish device health, listen for commands, and poll for signed application updates.

## Features

- Publishes heartbeats to `devices/{deviceId}/status`
- Subscribes to `devices/{deviceId}/commands`
- Periodically polls an HTTP endpoint for update metadata (stubbed for future work)
- Structured logging via `pino`

## Setup

```sh
cd rpi-agent
npm install
cp .env.example .env # adjust MQTT broker URL, device identifiers, update endpoint
npm run dev
```

Set `HEARTBEAT_INTERVAL` to control heartbeat frequency (milliseconds). During production deployments copy the built artefacts to each Pi or build the provided Docker image for containerized environments.

## Systemd service

On Raspberry Pi OS you can run the agent as a systemd service:

```
[Unit]
Description=Radio Revive Device Agent
After=network.target

[Service]
Type=simple
Environment=NODE_ENV=production
WorkingDirectory=/opt/radio-revive-agent
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start with:

```sh
sudo systemctl enable radio-revive-agent --now
```
