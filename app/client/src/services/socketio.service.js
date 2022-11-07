import { io } from 'socket.io-client';


class SocketioService {
  socket;
  constructor() {
    this.countdown = ''
  }

  setupSocketConnection() {

    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);

    this.socket.on('newTicket', (data) => {
      console.log('ticket:',data);
    });

    this.socket.on('getTime', (data) => {
      console.log(data);
    });

    this.socket.on('getCountDown', (data) => {
      console.log(data);
      this.countdown = data;
    });
  }

  getSocketUsers() {
    this.socket.on('UserNumber', (data) => {
      console.log(data);
      return data;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }


}


export default new SocketioService();