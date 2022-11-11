<template>
  <div>
    <div class="h-screen w-screen m-0 -mb-12" :class="this.$store.state.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'">
      <NavbarWallet :users="users" :balance="balance" :time="time" />
      <div class="flex flex-wrap top-24 left-0 right-0" :class="this.$store.state.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'">
        <PotPanel :date="date" :potSOL="potSOL" :potUSD="potUSD" :tickets="tickets" :nPlayers="nPlayers" :wallet="user_wallet" />
        <PlayPanel @commit="(number) => commitNumber(number)" v-on="newTicket" :balance="balance" :potSOL="potSOL" :tickets="tickets" />
        <HistoryPanel />
      </div>
      <div class="p-4 pt-8 text-center text-xs text-gray-400" :class="this.$store.state.dark ? 'bg-gray-900' : 'bg-gray-100'" > 
        <div class="flex justify-center items-center rounded-xl m-4">
          <!-- Server time -->
          <div class="text-center text-md tracking-widest font-semibold justify-center mr-8 text-gray-400">
            {{time}}<span class="text-xs"> UTC</span>
          </div>
          <!-- Users connected -->
          <div class="text-center text-md tracking-widest font-semibold justify-center mr-8 text-gray-400">
            <span class="text-xs">CONNECTED: </span>{{users}}
          </div>
          <!-- Users flag -->
          <div class="text-center text-md tracking-widest font-semibold justify-center mr-8 text-gray-400">
            {{location.flag}}
          </div>
        </div>
        Make with 💓 by Solucky Games © All rights reserved. <br>Built in <a href="https://solana.com/" target="_blank" class="underline">Solana</a> in 2022. Good luck all!
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
import { ref, watchEffect } from 'vue';
import { useAnchorWallet, useWallet } from 'solana-wallets-vue';
import { Connection, PublicKey, clusterApiUrl, SystemProgram, Transaction } from '@solana/web3.js';
import { io } from 'socket.io-client';
import commit_sound from './assets/sounds/3.wav';
import commited_sound from './assets/sounds/2.wav';
import pot_sound from './assets/sounds/pot.mp3'
import store from './store';

const preflightCommitment = 'processed'
const cluster = 'devnet'
const commitSOL = 1;


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


    const time = ref('');
    function getTime () {
      const date = new Date
      const hours = formatTime(date.getUTCHours());
      const minutes = formatTime(date.getMinutes());
      const seconds = formatTime(date.getSeconds());
      return `${hours}:${minutes}:${seconds}`;
    }
    const pot_audio = new Audio(pot_sound);
    setInterval( () => {
      time.value = getTime();
      if ( time.value === '14:56:00' && store.state.sound )
        pot_audio.play();
    }, 1000);

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
      potSOL.value = data.potSOL || 0;
      potUSD.value = data.potUSD || 0;
    });

    // tickets
    const tickets = ref([]);
    socket.on('getTickets', (data, error) => {
      if (error) console.log('Error on socket:', error);
      console.log('tickets', data );
      tickets.value = data;
    });

    // tickets
    const nPlayers = ref(0);
    socket.on('nPlayers', (data, error) => {
      if (error) console.log('Error on socket:', error);
      console.log('tickets', data );
      nPlayers.value = data;
    });

    // User location
    async function userLocation () {
      const flag = ref('');
      const country = ref('');
      const city = ref('');
      fetch('https://api.ipregistry.co/?key=0nxj6f90k9nup0j3')
      .then(function (response) {
        return response.json();
      })
      .then(function (payload) {
        console.log(payload);
        flag.value = payload.location.country.flag.emoji;
        country.value =  payload.location.country.code;
        city.value =  payload.city;
      });
      return { flag, country, city };
    }
    const location = ref('');
    watchEffect(async () => {
      location.value = await userLocation()
    });

    // User wallet
    const wallet = useAnchorWallet();
    const connection = new Connection(process.env.VUE_APP_CLUSTER_URL, 'connected')
    const balance = ref();
    setInterval( () => {
      watchEffect(async () => {
      const bal = await connection.getBalance(wallet.value.publicKey)/1000000000;
      balance.value = Math.floor(bal*100)/100;
      })
    }, 10000);

    const user_wallet = ref('');
    if ( wallet.value )
      user_wallet.value = wallet.value.publicKey;

    const ticket = ref('')
    
    // Commit Number
    async function commitNumber (number) {

      const audio1 = new Audio(commit_sound);
      const audio2 = new Audio(commited_sound);
      if ( store.state.sound )
        audio1.play();

      if (! wallet.value) {
        return alert('Connect your wallet first!')
      } 

      // for ( const num of tickets ) {
      //   if ( num.__num__ == number.value )
      //     return alert('This number is already commited! Try another one.')
      // }
      
      const connection = new Connection(clusterApiUrl(cluster), preflightCommitment)
      const bal = await connection.getBalance(wallet.value.publicKey)/1000000000;

      if (bal < commitSOL) 
        return alert('Not enough SOL in your wallet. Minimum funds needed: 1 SOL')

      const { sendTransaction } = useWallet();
      const masterPubKey = new PublicKey(process.env.VUE_APP_MASTER_WALLET);
      const transaction = new Transaction().add(
          SystemProgram.transfer({
              fromPubkey: wallet.value.publicKey,
              toPubkey: new PublicKey(masterPubKey),
              lamports: commitSOL*1000000000,
              message: number.value})
      )

      const signature = await sendTransaction(transaction, connection);
      console.log(signature);
      
      await connection.confirmTransaction(signature, number.value);// processed');
      if ( store.state.sound )
        audio2.play();
      //const location = await userLocation();
      ticket.value = emitTicket(number);

      //commitPop.value = true;

    }

    function emitTicket(number) {
      // const date = new Date();
      // const hour = String(date.getUTCHours()).length < 2 ? '0' + String(date.getUTCHours()) : String(date.getUTCHours());
      // const minutes = String(date.getMinutes()).length < 2 ? '0' + String(date.getMinutes()) : String(date.getMinutes());
      const ticket = `, ${number}, false, '${wallet.value.publicKey.toBase58()}', '${location.value.flag}', ${potSOL.value}, ${Date.now()}`;
      socket.emit('newTicket', ticket);
      //socket.emit('postTicket', ticket);
      console.log(socket.on('postTicket'))
      console.log(ticket)
    }

    return {
      socket,
      users,
      balance,
      date,
      time,
      potSOL,
      potUSD,
      tickets,
      nPlayers,
      location,
      commitNumber,
      user_wallet
    }
  }
  
 
}
</script>

<style>

html {
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background-color: rgba(184, 184, 184, 0.692);
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


