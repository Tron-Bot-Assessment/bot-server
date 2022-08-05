function getFormattedTime(timestamp) {
  const date = new Date(timestamp);
  return date.toUTCString();
}

function shortenAddress(address, chars = 4) {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

function getStartOfDayTimestamp() {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  return startOfDay.getTime();
}

function getCurrentDate() {
  const date = new Date();
  const result = date.toISOString().split('T')[0];
  return result;
}

function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

module.exports = {
  getFormattedTime,
  getStartOfDayTimestamp,
  getCurrentDate,
  shortenAddress,
  financial
};
