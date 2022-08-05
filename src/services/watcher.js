const TronWeb = require('tronweb');
const constants = require('../constants');
const bot = require('./bot');

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { 'TRON-PRO-API-KEY': process.env.TRON_PRO_API_KEY, 'Content-Type': 'application/json' },
  privateKey: process.env.PRIVATE_KEY,
});

function startEventListener() {
  tronWeb
    .contract()
    .at(constants.USDT_CONTRACT)
    .then((contract) => {
      contract.Transfer().watch((err, event) => {
        if (err) {
          return console.error('Error with transfer event:', err);
        }
        console.log(event);
        if (event && event.result) {
          const from = tronWeb.address.fromHex(event.result.from);
          const to = tronWeb.address.fromHex(event.result.to);
          if (
            constants.WATCH_WALLET === from ||
            constants.WATCH_WALLET === to
          ) {
            const message = `
              <b>USDT/TRC20 Transaction</b> \n\n <i>Transaction:</i>  <a href="https://tronscan.org/#/transaction/${event.transaction}">${shortenAddress(event.transaction, 6)}</a> \n <i>From:</i>  <a href="https://tronscan.org/#/address/${from}">${shortenAddress(from)}</a> \n <i>To:</i>  <a href="https://tronscan.org/#/address/${to}">${shortenAddress(to)}</a> \n <i>Amount:</i>  <b>${Number(event.result.value) / 1000000} USDT</b> \n <i>Time:</i>  <code>${getFormattedTime(event.timestamp)}</code>`;
            bot.sendMessage(constants.CHAT_ID, message, {parse_mode : "HTML"});
          }
        }
      });
    });
}

function getFormattedTime(timestamp) {
  const date = new Date(timestamp);
  return date.toUTCString();
}

function shortenAddress(address, chars = 4) {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

module.exports = {
  startEventListener,
};
