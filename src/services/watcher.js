const TronWeb = require('tronweb');
const axios = require('axios');
const constants = require('../constants');
const bot = require('./bot');
const { getFormattedTime, getStartOfDayTimestamp, shortenAddress, financial } = require('../utils');
const { io } = require('..');

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { 'TRON-PRO-API-KEY': process.env.TRON_PRO_API_KEY, 'Content-Type': 'application/json' },
  privateKey: process.env.PRIVATE_KEY,
});

const axiosInstance = axios.create({
  headers: { 'TRON-PRO-API-KEY': process.env.TRON_PRO_API_KEY, 'Content-Type': 'application/json' },
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
        if (event && event.result) {
          const from = tronWeb.address.fromHex(event.result.from);
          const to = tronWeb.address.fromHex(event.result.to);
          if (
            constants.WATCH_WALLET === from ||
            constants.WATCH_WALLET === to
          ) {
            const message = `<b>USDT/TRC20 Transaction</b> \n\n <i>Transaction:</i>  <a href="https://tronscan.org/#/transaction/${event.transaction}">${shortenAddress(event.transaction, 6)}</a> \n <i>From:</i>  <a href="https://tronscan.org/#/address/${from}">${shortenAddress(from)}</a> \n <i>To:</i>  <a href="https://tronscan.org/#/address/${to}">${shortenAddress(to)}</a> \n <i>Amount:</i>  <b>${Number(event.result.value) / constants.DECIMALS} USDT</b> \n <i>Time:</i>  <code>${getFormattedTime(event.timestamp)}</code>`;
            bot.sendMessage(constants.CHAT_ID, message, {parse_mode : "HTML"});
            io.emit("newTransaction");
          }
        }
      });
    });
}

async function getDailyTotal() {
  let totalIn = 0;
  let totalOut = 0;
  const min_block_timestamp = getStartOfDayTimestamp();
  const url = `${constants.BASE_URL}/accounts/${constants.WATCH_WALLET}/transactions/trc20?contract_address=${constants.USDT_CONTRACT}&limit=200&only_confirmed=true&min_block_timestamp=${min_block_timestamp}`;
  try {
    const res = await axiosInstance.get(url);
    if (res.status === 200) {
      const txs = res.data.data;

      const txsIn = txs.filter((tx) => tx.to === constants.WATCH_WALLET);
      const txsOut = txs.filter((tx) => tx.from === constants.WATCH_WALLET);
      txsIn.forEach((tx) => {
        totalIn += Number(tx.value) / constants.DECIMALS;
      });
      txsOut.forEach((tx) => {
        totalOut += Number(tx.value) / constants.DECIMALS;
      });
    }
  } catch (err) {
    console.err('getDailyTotal error: ', err);
  }
  
  return { totalIn: financial(totalIn), totalOut: financial(totalOut) };
}

async function getBalanceOf() {
  const contract = await tronWeb.contract().at(constants.USDT_CONTRACT);
  const value = await contract.balanceOf(constants.WATCH_WALLET).call();
  const balance = value.toNumber() / constants.DECIMALS;
  return financial(balance);
}

module.exports = {
  startEventListener,
  getDailyTotal,
  getBalanceOf
};
