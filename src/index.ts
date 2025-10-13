import { spawn } from 'child_process';
import mqtt from 'mqtt';
import { logger } from './logger.js';
import { initializeFirebase, getFirestore } from './config/firebase.js';
import { getDeviceId, getGroupStreamUrl, updateDeviceHeartbeat } from './config/loader.js';

const DEFAULT_STREAM = 'https://ice1.somafm.com/groovesalad-256-mp3';
const MQTT_URL = process.env.MQTT_URL || 'mqtt://localhost:1883';
const ORGANIZATION_ID = 'LdpwUPcwIFUZjIwYph8Z';

let playerProcess: any = null;
let currentUrl: string = DEFAULT_STREAM;
let deviceId: string;
let mqttClient: mqtt.MqttClient;
let firestore: any;

function playStream(url: string) {
  if (playerProcess) {
    try { playerProcess.kill(); } catch (e) {}
  }

  currentUrl = url;
  logger.info({ url }, '🎵 Starting music...');

  playerProcess = spawn('mpv', [
    '--no-video',
    '--audio-device=alsa',
    '--really-quiet',
    url
  ]);

  playerProcess.on('error', (error: Error) => {
    logger.error({ error }, '❌ Failed to start player');
  });

  playerProcess.on('spawn', () => {
    logger.info('✅ Music started successfully!');
    setTimeout(() => {
      publishStatus();
      updateFirestoreStatus();
    }, 100);
  });

  playerProcess.on('exit', (code: number) => {
    logger.warn({ code }, '⏹️ Player stopped');
    playerProcess = null;
    setTimeout(() => {
      publishStatus();
      updateFirestoreStatus();
    }, 100);
  });
}

function publishStatus() {
  if (!mqttClient || !mqttClient.connected) {
    return;
  }

  try {
    const status = {
      device_id: deviceId,
      playing: playerProcess !== null,
      current_url: currentUrl,
      timestamp: new Date().toISOString()
    };

    const topic = `radio-revive/${ORGANIZATION_ID}/device/${deviceId}/status`;
    mqttClient.publish(topic, JSON.stringify(status), { qos: 0, retain: false });
  } catch (error) {
    logger.error({ error }, 'Error in publishStatus');
  }
}

async function updateFirestoreStatus() {
  try {
    const isPlaying = playerProcess !== null;
    await updateDeviceHeartbeat(firestore, deviceId, isPlaying, currentUrl);
  } catch (error) {
    logger.error({ error }, 'Failed to update Firestore status');
  }
}

async function bootstrap() {
  try {
    logger.info('🚀 Radio Revive Agent starting...');

    await initializeFirebase();
    firestore = getFirestore();

    deviceId = await getDeviceId();
    logger.info({ deviceId }, '📱 Device ID generated');

    // Send initial heartbeat
    await updateFirestoreStatus();

    // Use unique client ID to avoid conflicts
    const uniqueClientId = `radio-revive-${deviceId}-${Date.now()}`;
    
    mqttClient = mqtt.connect(MQTT_URL, {
      clientId: uniqueClientId,
      clean: true,
      keepalive: 60,
      connectTimeout: 30000,
      reconnectPeriod: 0
    });

    mqttClient.on('connect', () => {
      logger.info({ clientId: uniqueClientId }, '✅ MQTT connected');
      
      const controlTopic = `radio-revive/${ORGANIZATION_ID}/device/${deviceId}/control`;
      mqttClient.subscribe(controlTopic, { qos: 1 }, (err) => {
        if (err) {
          logger.error({ err }, 'Failed to subscribe to control topic');
        } else {
          logger.info({ topic: controlTopic }, '📡 Subscribed to control topic');
        }
      });

      setTimeout(() => publishStatus(), 100);
    });

    mqttClient.on('message', (topic: string, message: Buffer) => {
      try {
        const payload = JSON.parse(message.toString());
        logger.info({ topic, payload }, '📨 Received MQTT message');

        if (payload.command === 'play' && payload.url) {
          playStream(payload.url);
        } else if (payload.command === 'stop') {
          if (playerProcess) {
            playerProcess.kill();
            playerProcess = null;
            setTimeout(() => {
              publishStatus();
              updateFirestoreStatus();
            }, 100);
          }
        } else if (payload.command === 'restart') {
          playStream(currentUrl);
        }
      } catch (error) {
        logger.error({ error }, 'Failed to parse MQTT message');
      }
    });

    mqttClient.on('error', (error: Error) => {
      logger.error({ error }, 'MQTT error');
    });

    mqttClient.on('close', () => {
      logger.warn('MQTT connection closed - attempting manual reconnect');
      setTimeout(() => {
        if (!mqttClient.connected) {
          logger.info('Manual reconnect attempt');
          mqttClient.reconnect();
        }
      }, 5000);
    });

    mqttClient.on('offline', () => {
      logger.warn('MQTT client offline');
    });

    logger.info('🔍 Looking for group stream URL...');
    const streamUrl = await getGroupStreamUrl(firestore, deviceId);
    
    if (streamUrl) {
      playStream(streamUrl);
    } else {
      logger.info('No group stream found, using default stream as fallback');
      playStream(DEFAULT_STREAM);
    }

    // Send heartbeat every 20 seconds (admin portal timeout is 30s)
    setInterval(() => {
      publishStatus();
      updateFirestoreStatus();
    }, 20000);

  } catch (error) {
    logger.error({ error }, '❌ Failed to start agent');
    process.exit(1);
  }
}

bootstrap();
