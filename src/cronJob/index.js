const nodeCron = require('node-cron');
const { getDailyTotal, getBalanceOf } = require('../services/watcher');
const constants = require('../constants');
const bot = require('../services/bot');
const { getCurrentDate, shortenAddress } = require('../utils');

// Run cron job every day at 23:59
const cronJob = nodeCron.schedule('59 23 * * *', async () => {
  await sendReport();
});

async function sendReport() {
  const {totalIn, totalOut} = await getDailyTotal();
  const net = await getBalanceOf();
  console.log(totalIn, totalOut, net);
  const message = `<b>Daily Report <code>${getCurrentDate()}</code></b> \n\n <i>Account</i>  <a href="https://tronscan.org/#/address/${constants.WATCH_WALLET}">${shortenAddress(constants.WATCH_WALLET)}</a> \n <i>Total In:</i>  <b>${totalIn} USDT</b> \n <i>Total Out:</i>  <b>${totalOut} USDT</b> \n <i>NET:</i>  <b>${net} USDT</b>`;
  bot.sendMessage(constants.CHAT_ID, message, {parse_mode : "HTML"});
}

module.exports = cronJob;
