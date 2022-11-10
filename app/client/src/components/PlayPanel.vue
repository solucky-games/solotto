<template>
  <!-- Play Panel. -->

  <div class="m-auto w-full max-w-md p-4">

    <div class="rounded-xl pt-2 pb-2 shadow-xl" :class="this.$store.state.dark ? 'bg-gray-800 shadow-gray-700' : 'bg-white'">
      <!-- Title Box -->
      <div class="px-4 text-center mt-10">
        <p class="uppercase text-sm tracking-widest text-gray-400 font-semibold">Commit a</p>
        <p class="uppercase text-3xl tracking-widest text-gray-400 font-semibold">Number</p>

        <div class="text-center uppercase text-sm tracking-widest font-semibold justify-center">
          <div class="flex justify-center mr-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" >
            <div class="uppercase text-xl text-gray-400 font-semibold m-4">Win</div>
            <div class="font-bold text-4xl mt-2" :class="this.$store.state.dark ? 'text-gray-200' : 'text-gray-800'"> {{potSOL}}<span  class="font-bold text-xl mt-4">SOL</span></div>
            <div class="uppercase text-xl text-gray-400 font-semibold m-4">in</div>
          </div>
          <div class="pl-2">
            <CountDown :_date="false" class="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" />

            <!-- <div class="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" >
              {{countdown}}
            </div> -->
          </div>      
        </div>

        <div class="text-center uppercase tracking-widest font-semibold justify-center border-1 rounded-xl pt-4">
          <div class="flex align-center justify-center mb-4">

            <div class="p-4 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Commited</p>
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Numbers</p>
              <div class="flex justify-center" >
                <p class="lowercase font-bold text-xl mt-2"
                  :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `x${12}`}}</p>
              </div>
            </div>

            <div class="p-4 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Your</p>
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Probability</p>
              <div class="flex justify-center" >
                <p class="font-bold text-xl mt-2"
                  :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `${yourProbability}%`}}</p>
              </div>
            </div>

            <div class="p-4 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Your</p>
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">ROI</p>
              <div class="flex justify-center" >
                <p class="font-bold text-xl mt-2"
                  :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `${nf.format(10000)}%`}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="uppercase text-s mb-5 tracking-widest text-gray-400 font-semibold text-center">Pick your number</div>

      <div class="font-bold text-4xl text-center p-7 rounded-xl m-4 cursor-pointer"
      :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-200'"
      @click="() => commitNumber"
      @mouseover="commitHover=true"
      @mouseleave="commitHover=false">
        <div class="text-2xl py-2 mr-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" v-if="commitHover">
          <a class="text-xl mr-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Commit 🚀 </a>
          {{nf.format(number)}}
        </div>
        <div v-else>{{ nf.format(number).replaceAll(',', ' ') }}</div>
      </div>
      
      <div class="grid grid-cols-3 gap-1 text-s font-semibold text-center py-4 px-4 rounded-xl">
        <button @click="clickNum(1)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-tl-xl align-middle relative">1</button>
        <button @click="clickNum(2)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">2</button>
        <button @click="clickNum(3)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-tr-xl align-middle relative">3</button>
        <button @click="clickNum(4)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">4</button>
        <button @click="clickNum(5)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">5</button>
        <button @click="clickNum(6)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">6</button>
        <button @click="clickNum(7)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-bl-xl align-middle relative">7</button>
        <button @click="clickNum(8)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">8</button>
        <button @click="clickNum(9)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-br-xl align-middle relative">9</button>
        <button @click="resetNum()"  :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-3 px-2 rounded-3xl m-3 align-middle relative">↻</button>
        <button @click="clickNum(0)" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-b-xl align-middle relative">0</button>
        <button @click="deleteNum()" :class="this.$store.state.dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-3 px-2 rounded-3xl m-3 align-middle relative">⇐</button>          <div/>
      </div>

    </div>
  </div>

</template>

<script>


import { ref } from 'vue';
import { Connection, PublicKey, clusterApiUrl, SystemProgram, Transaction } from '@solana/web3.js';
import { useAnchorWallet, useWallet } from 'solana-wallets-vue';
import CountDown from './CountDown.vue';
// import utils from './utils';

const preflightCommitment = 'processed'
const cluster = 'devnet'
const commitSOL = 1;
const maxNumber = 1000000000;

export default {
  props: [
    'socket',
    'countdown',
    'potSOL',
    'wallet',
    'balance'
  ],
  components: {
    CountDown,
    // PopCommit,
  },
  setup () {


    // const connection = new Connection(clusterApiUrl(process.env.APP_VUE_CLUSTER), 'processed');
    // const userBalance = ref();
    // watchEffect(async () => {
    //   const balance = await connection.getBalance(wallet.value.publicKey)/1000000000;
    //   userBalance.value = Math.floor(balance*100)/100;
    // })

    // User wallet
    const wallet = useAnchorWallet();

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


    const ticket = ref('')
    // Commit Number
    async function commitNumber () {

      if (! wallet.value) {
        return alert('Connect your wallet first!')
      } 

      // if ( tickets.value[number.value] && checkNumber(number.value) )
      //   return alert('This number is already commited! Try another one.')

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

      const location = await userLocation();
      ticket.value = emitTicket(location.flag);

      commitPop.value = true;

    }

    function emitTicket(flag) {
      const date = new Date();
      const hour = String(date.getUTCHours()).length < 2 ? '0' + String(date.getUTCHours()) : String(date.getUTCHours())
      const minutes = String(date.getMinutes()).length < 2 ? '0' + String(date.getMinutes()) : String(date.getMinutes())
      return `'${hour}:${minutes}', ${number.value}, false, '${wallet.value.publicKey.toBase58()}', '${flag}'', ${this.potSOL}, ${date.now()}`;
      // socket.emit('newTicket', ticket);
      // console.log(socket.on('postTicket'))
      // console.log(ticket)
    }

    const number = ref('0')
    const nf = Intl.NumberFormat();

    // Keyboard functionality
    function clickNum (n) {
      if (number.value[0] === '0')
        return number.value = String(n)
      
      if ( number.value+n <= maxNumber )
        number.value += n
      else
        return alert(`Number must be between 0 and ${nf.format(maxNumber)}, including both.`)     
    }
    function deleteNum () {
      if (number.value.length > 1)
        number.value = number.value.slice(0, -1);
      else resetNum();
    }
    function resetNum () {
      number.value = '0';
    }

    
    const commitPop = ref(false);
    
    //const yourNumbers = ref(0);
    // function updateYourNumbers () {
    //   const address = wallet.value.publicKey.toBase58();
    //   const arr = [];
    //   for (const [key, value] of Object.entries(tickets.value)) {
    //     if (value === address)
    //       arr.push(key);
    //   }
    //   yourNumbers.value = arr.length;
    // }
    // const yourProbability = ref(0);
    // function updateYourProbability () {
    //   yourProbability.value = Math.floor((yourNumbers.value/tickets.value.length)*10000)/100;
    // }
    // const yourROI = ref(0);
    // function updateYourROI () {
    //   // yourROI.value = Math.floor((this.potSOL.value/yourNumbers.value-1)*10000)/100;
    // }
    // watchEffect(async () => {
    //   updateYourNumbers();
    //   updateYourProbability();
    //   updateYourROI();
    // });
    
    return { 
      commitNumber,
      clickNum,
      deleteNum,
      resetNum,
      number,
      nf,
      //tickets,
      // shortWallet,
      // yourNumbers,
      // yourProbability,
      // yourROI,
      // markWallet,
      location,
      commitPop,
      ticket
    }
  },
  methods: {
    onClickButton () {
      this.$emit('clicked', this.commitNumber)
    }
  },
  data() {
    return {
      commitHover: false,
      commiting: false,
    }
  }
}
</script>
