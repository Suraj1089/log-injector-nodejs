// sendLogs.js

const fs = require('fs');
const socketIOClient = require('socket.io-client');

const logsFilePath = 'logs.json';

try {
  const logs = JSON.parse(fs.readFileSync(logsFilePath, 'utf8'));

  const socket = socketIOClient('http://localhost:3000');

  // Send each log to the server using WebSocket
  logs.forEach(async (log, index) => {
    try {
      socket.emit('newLog', log);
      console.log(`Log ${index + 1} sent successfully via WebSocket.`);
    } catch (error) {
      console.error(`Error sending log ${index + 1}:`, error.message);
    }
  });
  
  // Close the socket after sending all logs
  socket.disconnect();
} catch (error) {
  console.error('Error reading logs file:', error.message);
}
