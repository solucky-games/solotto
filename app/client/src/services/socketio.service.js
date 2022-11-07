import { io } from 'socket.io-client';



class SocketioService {
  socket;
  constructor() {
    this.countdown = ''
  }

  setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);

    this.socket.emit('my message', 'Hello there from Vue.');

    this.socket.on('my broadcast', (data) => {
      console.log(data);
    });

    this.socket.on('getTime', (data) => {
      console.log(data);
    });

    this.socket.on('getCountDown', (data) => {
      console.log(data);
      this.countdown = data;
    });

    this.socket.on('UserNumber', (data) => {
      console.log(data);
    });

  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }


}


export default new SocketioService();