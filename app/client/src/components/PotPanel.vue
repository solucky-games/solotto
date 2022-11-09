<template>
      <!-- Pot Panel. -->

    <div class="m-auto w-full max-w-md p-4">

      <div class="p-4 text-gray-600 rounded-xl text-center shadow-xl" :class="this.$store.state.dark ? 'bg-gray-800 shadow-gray-870' : 'bg-white'">          
        
        <div class="flex align-center justify-center">
          <div class="p-4 text-center">
            <p class="uppercase text-sm tracking-widest text-gray-400 font-semibold mt-4">Today's</p>
            <p class="uppercase text-3xl tracking-widest text-gray-400 font-semibold">Pot</p>

            <div class="flex ">
              <div class="flex justify-center mr-3 p-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" >
                <p class="font-bold text-2xl mt-3 mr-1"
                >◎ </p>
                <p class="font-bold text-4xl mt-2"
                > {{ potSOL }}</p>
              </div>

              <div class=" text-4xl mt-2 mr-4 text-gray-400">/</div>

              <div class="flex justify-center pt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" >
                <p class="font-bold text-2xl mr-1"
                >$ </p>
                <p class="font-bold text-2xl"
                > {{ potUSD }}</p>
              </div>
            </div>

            <div class="mt-2 pl-2">
              <!-- <CountDown :_date="true" class="text-center text-2xl tracking-widest font-semibold justify-center"  :class="this.$store.state.dark ? 'text-gray-200' : 'text-gray-800'"/> -->
              <div class="text-center text-2xl tracking-widest font-semibold justify-center"  :class="this.$store.state.dark ? 'text-gray-200' : 'text-gray-800'">
                <div class="text-gray-400 text-xl">
                  {{ date }}
                </div>
                {{countdown}}
              </div>
            </div>
  
          </div>
        </div>
        <div class="flex align-center justify-center mt-4">
          <div class="p-2 mr-1 text-center">
            <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Total</p>
            <p class="uppercase text-xl tracking-widest text-gray-400 font-semibold">Numbers</p>
            <div class="flex justify-center" >
              <p class="font-bold text-2xl mt-2"
                :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
              > {{users}}</p>
            </div>
          </div>

          <div class="p-2 ml-1 text-center">
            <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Total</p>
            <p class="uppercase text-xl tracking-widest text-gray-400 font-semibold">Players</p>
            <div class="flex justify-center" >
              <p class="font-bold text-2xl mt-2"
                :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
              > {{ `${nPlayers}`}}</p>
            </div>
          </div>
        </div>

        <!-- commited numbers -->
        <div class="uppercase text-xs mt-3 mb-5 tracking-widest text-gray-400 font-semibold">Current commited numbers</div>
          <div>{{newTicket.number}}</div>
          <lo class="max-h-96 min-h-96 h-96 flex flex-col-reverse align-start overflow-y-auto bg-gray-100 p-2 rounded-xl shadow-inner" :class="this.$store.state.dark ? 'bg-gray-700' : 'bg-gray-100'">
            <div v-for="x in tickets" :key="x.id" class="py-1" :class="this.$store.state.dark ? 'text-gray-200' : 'bg-text-gray-800'">
              <div class="hover:font-semibold grid grid-cols-10 gap-3">
                <div class="text-xs col-span-2"  :class="markWallet(user, x.wallet) ? 'text-purple-400 font-bold' : 'text-grey-600'">{{ x.hour }}</div>
                
                <a class="col-span-3" :href="'https://explorer.solana.com/address/'+x.wallet+'?cluster='+cluster" target="_blank" :class="markWallet(x.wallet)">
                  <div class="text-xs text-left">{{ shortWallet(x.wallet, 4) }}</div>
                </a>
                <a class="col-span-1" :href="'https://google.com/search?q='+x.country" target="_blank">
                  <div class="text-xs">{{ x.flag }}</div>
                </a>
                <a class="text-right col-span-3" :href="'https://explorer.solana.com/address/'+x.wallet+'?cluster='+cluster" target="_blank" :class="markWallet(x.wallet)">
                  <div class="text-[13px] text-center" :class="markWallet(x.wallet)"> {{ nf.format(x.number).replaceAll(',', ' ') }}</div>
                </a>
                <a class="text-right col-span-1" :href="'https://explorer.solana.com/address/'+x.wallet+'?cluster='+cluster" target="_blank" :class="markWallet(x.wallet)">
                  <div v-if="x.verified" class="text-[10px] text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" :class="markWallet(x.wallet)"> {{ '✔️' }}</div>
                </a>
              </div>
            </div>
          </lo>

        </div>

    </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import { PublicKey } from '@solana/web3.js';
import coinTicker from 'coin-ticker';
// import CountDown from './CountDown.vue';
import { shortWallet, markWallet } from './utils';
import { useWorkspace } from '@/services/useWorkspace';
//import SocketioService from '@/services/socketio.service';
//import { io } from 'socket.io-client';
// import SocketioService from '@/services/socketio.service.js';



export default ({
  props: [
    'date',
    'countdown',
    'potSOL',
    'potUSD',
    'newTicket',
    'tickets'
  ],
  components: {
    //CountDown
  },
  methods: {
    shortWallet,
    markWallet
  },
  setup() {
    const user = '';
    const workspace = useWorkspace();
    const masterPubKey = new PublicKey(process.env.VUE_APP_MASTER_WALLET);
    const nf = Intl.NumberFormat();
    const potSOL = ref(0);
    const potUSD = ref(0);
    watchEffect(async () => {
      potSOL.value = await workspace.connection.getBalance(masterPubKey)/1000000000;
      potSOL.value = Math.floor(potSOL.value);
      coinTicker(process.env.VUE_APP_EXCHANGE, 'SOL_USD').then( (price) => { 
        potUSD.value = nf.format(potSOL.value*price.last).split('.')[0];
      });
    });
    // const tickets = ref([]);
    // const nTickets = ref(0);
    // const nPlayers = ref(0);
    // watchEffect(async () => {
    //   const res = await fetch(process.env.VUE_APP_DB_TICKETS_URL);
    //   const data = await res.json();
    //   tickets.value = data.reverse();
    //   console.log(tickets.value)
    //   nTickets.value = tickets.value.length;

    //   const uniqueWallets = [];
    //   for (const ticket of tickets.value) {
    //     if ( !uniqueWallets.includes(ticket.wallet) )
    //       uniqueWallets.push(ticket.wallet);
    //   }
    //   nPlayers.value = uniqueWallets.length;
    // });




    return {
      nf,
      user,
      // potSOL,
      // potUSD,
      // tickets,
      // nTickets,
      // nPlayers,
    }
  },
  data() {
    // const socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
    // const users = ref();
    // socket.on('UserNumber', (data) => {
    //   console.log(data);
    //   users.value = String(data).split(' ')[1];
    //   return data;
    // });

    // const users = SocketioService.getSocketUsers();

    // return {
    //   users
    // }
  }
})
</script>
