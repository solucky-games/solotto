<template>
  <div :class="this.$store.state.dark ? 'bg-gray-900' : 'bg-gray-100'">

    <video src="../assets/vids/hero.mp4" autoplay loop class="fixed h-screen m-0 z-0 opacity-75" ></video>

    <div class="flex grid-cols-2 flex-wrap h-screen m-0 text-center align-center justify-center" :class="this.$store.state.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100'" >

      <div class="z-20 text-center align-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500" >
        <h1 class="text-7xl font-extrabold shadow-white mt-52 md:text-9xl lg:text-[150px] md:mr-20">
          SOLUCKY
        </h1>
        <h1 class="text-3xl font-bold shadow-white mt-12 text-white md:text-4xl lg:text-[60px] md:mr-20">
          THE SOLANA GAMBLING <br><br> COMMUNITY 🖕
        </h1>
        <div class="flex flex-wrap justify-center mt-24 md:mr-20">
        <button class="border bg-gradient-to-tr from-blue-400 to-purple-600 text-white hover:border-white p-4 rounded-xl m-4 px-8 font-bold border-purple-500 hover:animate-bounce transition-colors">
          😈 I'M A DEGEN
        </button>
        <button class="border bg-gradient-to-tr from-blue-400 to-purple-600 text-white hover:border-white p-4 rounded-xl m-4 px-8 font-bold border-purple-500 hover:animate-bounce transition-colors">
          😇 NOT FOR ME
        </button>
        <button class="border bg-gradient-to-tr from-blue-400 to-purple-600 text-white hover:border-white p-4 rounded-xl m-4 px-8 font-bold border-purple-500 hover:animate-bounce transition-colors">
          👽 WHAT IS A NFT?
        </button>
      </div>
      </div>

      <collection-panel class="mt-20 m-10 z-10 md:ml-20"></collection-panel>
      
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

<style scoped>
video{
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  position: fixed;
  top: 0;
  left: 0;
}

</style>
