// require the express moule
const express = require('express');
// create a new express application
const app = express();
// require the http module
const http = require('http').Server(app);
// require the socket.io module
const io = require('socket.io');
// create an event listener
const socket = io(http);

// to listen to messages
socket.on('connection', (socket) => {

  console.log('user connected');
  // on close client disconnect socket
  socket.on('disconnect', ()=> {
    console.log("Disconnected")
  })
  // new ticket
  socket.on('new ticket', function(ticket) {
    
    console.log('number:', ticket.number);
    
    //broadcast ticket to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", 
    { 
      date: ticket.date,
      hour: ticket.hour,
      wallet: ticket.wallet,
      number: ticket.number,
      verified: ticket.verified,
      country: ticket.country,
      flag: ticket.flag,
      twitter: ticket.twitter,
    });

    //save chat to the database
    connect.then( ()  =>  {
      console.log("Connected correctly to the server db");
      const newTicket = new Ticket(
      { 
        date: ticket.date,
        hour: ticket.hour,
        wallet: ticket.wallet,
        number: ticket.number,
        verified: ticket.verified,
        country: ticket.country,
        flag: ticket.flag,
        twitter: ticket.twitter,
      });
      newTicket.save();
    });
  });

});

const PORT = 8321;
// wire up the server to listen to our PORT
http.listen(PORT, () => {
  console.log('connected to port: '+ PORT);
});

// database connection
const  Ticket  = require("./models/Ticket");
const  connect  = require("./db/dbconnect");
