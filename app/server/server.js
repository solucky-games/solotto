'use strict';

require('dotenv').config()

//const TicketCtrl = require('./controller/ticket.controller');
// const Ticket = require('./model/ticket.model');
const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');

const utils = require('./utils/utils');
const ctrls = require('./controllers/tickets.controller');
// const web3 = require('./utils/web3');
const web3 =  require('@solana/web3.js');
const coinTicker = require('coin-ticker');

router.post('/api/tickets', ctrls.postTicket);
router.get ('/api/tickets', ctrls.getTickets);

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(router);
app.get('/', (req, res) => {
  res.send('<h1>Welcome hackers to your next challenge! Hack me, get paid.</h1>');
});

// Connect to PotsgreSQL
const { Client } = require('pg');
const postgreURL = process.env.POSTGRE_URL;
const client = new Client(postgreURL);

client.connect(function(err) {
  if(err) {
    return console.error('Could not connect to DB...', err);
  } else {
    console.log('DB connected successfully!\n');
  }
});

const server = require('http').createServer(app);
const PORT = 5001;
// run server
server.listen(PORT, ()=> {
  console.log('listening on port', PORT);
  setInterval( function() {
    const time =  utils.getTime();
    const arr = time.split(':');
    if ( arr[2] == 0 ) {
      console.log(time);
      if ( arr[1] == 25 && arr[0] == 18 ) {
        const date = utils.getDateSQL();
        ctrls.createTable(client, date); 
      }
    }
  }, 1000);
});

// socket.io 
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST']
  }
});

let countUsers = 0;

io.on('connection', (socket) => {

  countUsers++;
  console.log(`${countUsers} users connected`);
  io.emit('UserNumber', `user_num: ${countUsers}`);
  io.emit('getDate', utils.getDate());

  setInterval( function() {
    const time = utils.getTime();
    const timeSplit = time.split(':');
    if ( timeSplit[2] == 0 ) {
      io.emit('getTime', `server_time: ${time}`);
      if ( timeSplit[0] == 0 && timeSplit[1] == 1 ) {
        io.emit('getDate', utils.getDate());
      }
    }
    io.emit('getCountDown', utils.countDown());
  }, 1000);

  setInterval( async function () {
    try {
      const masterPubKey = new web3.PublicKey('GANTRxDjP5BoUExWqVLAC9yVhC29dThviuqNmMDdSEF4');
      const connection = new web3.Connection('https://api.devnet.solana.com', 'processed');
      const potSOL = Math.floor(await connection.getBalance(masterPubKey)/1000000000);
      coinTicker('bitstamp', 'SOL_USD').then( (price) => { 
        const potUSD = Math.floor(potSOL*price.last)
        io.emit('getPOT', { potSOL, potUSD });
      });
    } catch (error) {
      console.log(error)
    }
  }, 3000);

  socket.on('disconnect', () => {
    countUsers--;
    console.log(`${countUsers} users connected`);
    io.emit('UserNumber', `user_num: ${countUsers}`)
  });

});
