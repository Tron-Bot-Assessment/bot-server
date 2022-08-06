require('dotenv').config();
const app = require('./config/express');
const logger = require('./config/logger');
const watcher = require('./services/watcher');
const cronJob = require('./cronJob');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running at ${PORT}`);
});

const io = new Server(server, { cors: { origin: '*' } });
io.on("connection", function (socket) {
  console.log("Made socket connection");
});

watcher.startEventListener();
cronJob.start();

module.exports = { io };
