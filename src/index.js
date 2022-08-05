require('dotenv').config();
const app = require('./config/express');
const logger = require('./config/logger');
const watcher = require('./services/watcher');
const cronJob = require('./cronJob');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running at ${PORT}`);
});

watcher.startEventListener();
cronJob.start();
