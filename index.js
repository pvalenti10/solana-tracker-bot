
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/solana-listener', async (req, res) => {
  const data = req.body;
  const transfers = data.events?.tokenTransfers || [];

  for (const tx of transfers) {
    const msg = `🚨 ${tx.fromUserAccount || tx.toUserAccount} just ${tx.fromUserAccount ? "sent" : "received"} ${tx.amount} ${tx.tokenSymbol || 'tokens'}\nToken: ${tx.mint}`;
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: msg
    });
  }

  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Server running');
});
