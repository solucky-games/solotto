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


// socket.io 
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://localhost:8080',
    methods: ['GET', 'POST']
  }
});


// run server
server.listen(PORT, ()=> {
  console.log('listening on port', PORT);

  setInterval( function() {
    const time = getTime();
    console.log(time);
  }, 1000);

  console.log('anything else?')
})


// functions

const getTime = () => {
  const date = new Date
  const hours = String(date.getUTCHours()).length < 2 ? '0' + String(date.getUTCHours()) : String(date.getUTCHours());
  const minutes = String(date.getMinutes()).length < 2 ? '0' + String(date.getMinutes()) : String(date.getMinutes());
  const seconds = String(date.getSeconds()).length < 2 ? '0' + String(date.getSeconds()) : String(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

const potTime = (time) => {

}