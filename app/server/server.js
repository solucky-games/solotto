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
  io.emit('UserNumber', `user_num: ${countUsers}`)

  setInterval( function() {
    const time = getTime();
    if ( time.split(':')[2] == 0 )
      io.emit('getTime', `server_time: ${time}`);
    io.emit('getCountDown', `prize_in: ${countDown()}`);
  }, 1000);


  
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

const countDown = () => {
  const time = getTime().split(':');
  const hours = formatTime(23-time[0]);
  const minutes = formatTime(59-time[1]);
  const seconds = formatTime(59-time[2]);
  return `${hours}h ${minutes}m ${seconds}s`;
}

const potTime = (time) => {

}