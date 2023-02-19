import { WebSocketServer } from 'ws';

const PORT = 8080;

export const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    ws.send(`Received ${data.toString()}`);
  });

  ws.on('error', (err) => ws.send(err));
  ws.send('CONNECTED');
});
