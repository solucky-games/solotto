<template>
  <div>
    <div class="h-screen w-screen m-0 -mb-12" :class="this.$store.state.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'">
      <NavbarWallet :users="users" :balance="balance" />
      <div class="flex flex-wrap top-24 left-0 right-0" :class="this.$store.state.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'">
        <PotPanel :date="date" :potSOL="potSOL" :potUSD="potUSD" :newTicket="newTicket" :tickets="tickets" />
        <PlayPanel v-on="newTicket" @clicked="newTicket" :countdown="countdown" :potSOL="potSOL" />
        <HistoryPanel />
        <!-- <button @click="newTicket">Send</button> -->
      </div>
      <div class="p-4 pt-8 text-center text-xs text-gray-400" :class="this.$store.state.dark ? 'bg-gray-900' : 'bg-gray-100'" > 
        Done with love by SOLucky Games © All rights reserved. 2022
      </div>
    </div>

    <!-- <CommitModal class="invisible hidden"/> -->
    
  </div>
</template>

<script>
import NavbarWallet from './components/NavbarWallet.vue';
import PotPanel from './components/PotPanel.vue';
import PlayPanel from './components/PlayPanel.vue';
import HistoryPanel from './components/HistoryPanel.vue';
// import CommitModal from './components/CommitModal.vue';
// import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
// import { initWallet } from 'solana-wallets-vue';
import { initWorkspace } from './services/useWorkspace';
// import SocketioService from './services/socketio.service.js';
import { ref, watchEffect } from 'vue';
import { io } from 'socket.io-client';
import { useWorkspace } from './services/useWorkspace';

// const wallets = [
//     new PhantomWalletAdapter(),
//     new SolflareWalletAdapter(),
// ]

// initWallet({ wallets, autoConnect: true })
initWorkspace()


export default {
  name: 'App',
  components: {
    NavbarWallet,
    PotPanel,
    PlayPanel,
    HistoryPanel,
    // CommitModal
  },
  data() {

    const socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
    const users = ref();
    socket.on('userNumber', (data) => {
      //console.log(data);
      users.value = String(data).split(' ')[1];
      return data;
    });

    function formatTime (num) {
    if (String(num).length < 2) 
      return '0' + String(num);
    else if (String(num).length < 1) 
      return '00';
    return String(num);
  }

    // function getTime () {
    //   const date = new Date
    //   const hours = formatTime(date.getUTCHours());
    //   const minutes = formatTime(date.getMinutes());
    //   const seconds = formatTime(date.getSeconds());
    //   return `${hours}:${minutes}:${seconds}`;
    // }

    const date = getDate()
    function getDate () {
      const date = new Date
      const year = formatTime(date.getUTCFullYear());
      const month = formatTime(date.getUTCMonth()+1);
      const day = formatTime(date.getUTCDate());
      return `${year}-${month}-${day}`;
    }

    // Pot 
    const potSOL = ref(0);
    const potUSD = ref(0);
    socket.on('getPOT', (data) => {
      //console.log(data);
      potSOL.value = data.potSOL;
      potUSD.value = data.potUSD;
    });

    // tickets
    const tickets = ref([]);
    socket.on('getTickets', (data, error) => {
      if (error) console.log('Error on socket:', error);
      console.log('tickets', data );
      tickets.value = data;
    });

    // newTicket
    function newTicket (ticket) {
      //const ticket = `'12:30', 123456, false, 'fhgjfdgfyuf3ggfrhlr', '🇯🇵', 38, ${Date.now()}`;
      socket.emit('newTicket',  ticket)
      console.log(ticket)
    }

    // User wallet
    const workspace = useWorkspace();
    const wallet = workspace.wallet
    const balance = ref();
    setInterval( () => {
      watchEffect(async () => {
      const bal = await workspace.connection.getBalance(workspace.wallet.value.publicKey)/1000000000;
      balance.value = Math.floor(bal*100)/100;
      // console.log(balance);
      })
    }, 1000)

    // watchEffect(async () => {
    //   const bal = await workspace.connection.getBalance(workspace.wallet.value.publicKey)/1000000000;
    //   balance.value = Math.floor(bal*100)/100;
    // })


    return {
      socket,
      users,
      balance,
      // countdown,
      date,
      potSOL,
      potUSD,
      newTicket,
      tickets,
      wallet
    }
  }
  
 
}
</script>

<style>

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background-color: rgba(129, 129, 129, 0.692);
  border-radius: 0.75rem;
  margin: 0.4rem;
  border-left: 1px solid rgba(211, 211, 211, 0);
}

::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background:  linear-gradient(30deg, #d31bb47c, #ae0ce05d);
  box-shadow: inset 0 0 6px #c41bd3,
}
</style>


