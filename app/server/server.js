'use strict';



const express = require('express');
const app = express();
const cors = require('cors');

const dates = ['2022-11-05', '2022-11-06']

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const server = require('http').createServer(app);
const PORT = 5001;

app.get('/', (req, res) => {
  res.send('<h1>Welcome hackers to your next challenge! Hack me, get paid.</h1>');
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

  io.emit('getDate', getDate());

  setInterval( function() {
    const time = getTime();
    const timeSplit = time.split(':');
    if ( timeSplit[2] == 0 ) {
      io.emit('getTime', `server_time: ${time}`);
      if ( timeSplit[0] == 0 && timeSplit[1] == 1 ) {
        io.emit('getDate', getDate());
      }
    }
    io.emit('getCountDown', countDown());
  }, 1000);


  setInterval( async function () {
    const masterPubKey = new web3.PublicKey('GANTRxDjP5BoUExWqVLAC9yVhC29dThviuqNmMDdSEF4');
    const connection = new web3.Connection('https://api.devnet.solana.com', 'processed');
    const potSOL = Math.floor(await connection.getBalance(masterPubKey)/1000000000);
    coinTicker('bitstamp', 'SOL_USD').then( (price) => { 
      const potUSD = Math.floor(potSOL*price.last)
      io.emit('getPOT', { potSOL, potUSD });
    });
  }, 3000);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    countUsers--;
    console.log(`${countUsers} users connected`);
    io.emit('UserNumber', `user_num: ${countUsers}`)

  });
  
  socket.on('newTicket', (ticket) => {
    console.log('message: ' + msg);
  });

});


// run server
server.listen(PORT, ()=> {
  console.log('listening on port', PORT);

  setInterval( function() {
    const time = getTime();
    if ( time.split(':')[2] == 0 )
      console.log(time);
  }, 1000);

})


// functions

const web3 =  require('@solana/web3.js');
const coinTicker = require('coin-ticker');

async function getMasterBalance() {
  
}

function createAccount(username, password) {
  return new Promise((resolve, reject) => {
    socket.emit('create account', {username:username, password:password});

    socket.once('create account return', (data) => resolve(data.failed));
  });
};


const formatTime = (num) => {
  if (String(num).length < 2) 
    return '0' + String(num);
  else if (String(num).length < 1) 
    return '00';
  return String(num);
}

const getTime = () => {
  const date = new Date
  const hours = formatTime(date.getUTCHours());
  const minutes = formatTime(date.getMinutes());
  const seconds = formatTime(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

const getDate = () => {
  const date = new Date
  const year = formatTime(date.getUTCFullYear());
  const month = formatTime(date.getUTCMonth());
  const day = formatTime(date.getUTCDate());
  return `${year}-${month}-${day}`;
}

const countDown = () => {
  const time = getTime().split(':');
  const hours = formatTime(23-time[0]);
  const minutes = formatTime(59-time[1]);
  const seconds = formatTime(59-time[2]);
  return `${hours}h ${minutes}m ${seconds}s`;
}

const potTime = (time) => {

}