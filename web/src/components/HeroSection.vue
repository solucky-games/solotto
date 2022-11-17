<template>
  <div :class="this.$store.state.dark ? 'bg-gray-900' : 'bg-gray-100'">
    <video src="../assets/vids/hero.mp4" autoplay="autoplay" loop class="fixed z-0 opacity-75" ></video>


    <div class="flex h-screen w-screen m-0 z-50" :class="this.$store.state.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'" >

      <div class="z-20" >
        <h1 class="text-[160px] font-extrabold shadow-white mt-52 ml-52 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          SOLUCKY
        </h1>
        <h1 class="text-6xl font-bold shadow-white mt-12 ml-52 text-white">
          BEST SOLANA GAMING <br> COMMUNITY 🖕
        </h1>
      </div>

      <collection-panel class="mt-52 z-50"></collection-panel>
      
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import { useAnchorWallet } from 'solana-wallets-vue';
import { Connection } from '@solana/web3.js';
import io from 'socket.io-client';
// import store from './store';
import CollectionPanel from './CollectionPanel.vue';

export default {
  name: 'HeroSection',
  components: {


    CollectionPanel
  },
  
  setup () {


    // if ( !store.state.sound )
    //   music.pause();

    const socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
         transports: ['websocket'],
        });
    const users = ref();
    socket.on('userNumber', (data) => {
      users.value = String(data).split(' ')[1];
      return data;
    });

    // function formatTime (num) {
    //   if (String(num).length < 2) 
    //     return '0' + String(num);
    //   else if (String(num).length < 1) 
    //     return '00';
    //   return String(num);
    // }

    // User wallet
    const wallet = useAnchorWallet();
    const user_wallet = ref('');
    try {
      user_wallet.value = wallet.value.publicKey;
    } catch { console.log('Wallet connection error')}
    const connection = new Connection(process.env.VUE_APP_CLUSTER_URL, 'connected')
    const balance = ref();
    watchEffect(async () => {
    try {
      user_wallet.value = wallet.value.publicKey;
    } catch { console.log('Wallet connection error')}
      const bal = await connection.getBalance(user_wallet.value)/1000000000;
      balance.value = Math.floor(bal*100)/100;
      setInterval( async () => {
        balance.value = Math.floor(await connection.getBalance(user_wallet.value)/1000000000*100)/100;
      }, 10000);
    });

    return {
      balance
    }

  }

 
}


</script>

