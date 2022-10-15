<script>

import { ref, watchEffect } from 'vue'
import { Connection, PublicKey, clusterApiUrl, SystemProgram, Transaction } from '@solana/web3.js'
import { WalletMultiButton, useAnchorWallet, useWallet } from 'solana-wallets-vue'
import CountDown from '@chenfengyuan/vue-countdown';
import { Buffer } from 'buffer'
import coinTicker from 'coin-ticker'
import {sendTicket} from './controller/sendTicket'
import {getTickets} from './controller/getTickets'
import {deleteTicket} from './controller/deleteTicket'


let tomorrow = new Date();
tomorrow.setDate(tomorrow.getUTCDate() + 1);
const year = tomorrow.getUTCFullYear()
const month = tomorrow.getUTCMonth()
const day = tomorrow.getUTCDate()
const expires = new Date(Date.UTC(year, month, day));
const now = new Date().getTime()
const time = (expires.getTime()-now);


// @ts-ignore
window.Buffer = Buffer;

//const programID = new PublicKey(idl.metadata.address)
const preflightCommitment = 'processed'

const masterWallet = '6i1zfRMWVEErVPkH4JUtEBj5PFk2VZgshAENhZi1Dj1k'
const cluster = 'devnet'
const commitSOL = 1;
const maxNumber = 1000000000;
const db_url = 'http://localhost:5000/'


export default {
  components: {
    WalletMultiButton,
    CountDown,
  },
  setup () {
    const dark = ref(false)
    const wallet = useAnchorWallet()
    
    const connection = new Connection(clusterApiUrl(cluster), preflightCommitment)
    //const provider = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment }))
    //const program = computed(() => new Program(idl, programID, provider.value))

    const prize = ref(0);
    const SOL_USD = ref();
    const balance = ref();

    watchEffect(async () => {
      console.log(await getTickets())
    })

    watchEffect(async () => {
      const pri = await connection.getBalance(new PublicKey(masterWallet))/1000000000;
      prize.value = Math.floor(pri*100)/100;
      coinTicker('bitstamp', 'SOL_USD').then((tick) => { SOL_USD.value = tick.last })
    })

    watchEffect(async () => {
      const bal = await connection.getBalance(wallet.value.publicKey)/1000000000;
      balance.value = Math.floor(bal*100)/100;
      
    })

    const location = ref()
    const flag = ref('');
    fetch('https://api.ipregistry.co/?key=0nxj6f90k9nup0j3')
    .then(function (response) {
        return response.json();
    })
    .then(function (payload) {
        console.log(payload);
        flag.value = payload.location.country.flag.emoji
        location.value =  payload.location.city;
    });

    const { sendTransaction } = useWallet();

    async function commitNumber () {

      if (! wallet.value) {
        return alert('Connect your wallet first!')
      } 

      if ( db.value[number.value] && chechNumber(number.value) )
        return alert('This number is already commited! Try another one.')

      await sendTicket(number.value, flag.value);

      const connection = new Connection(clusterApiUrl(cluster), preflightCommitment)

      const bal = await connection.getBalance(wallet.value.publicKey)/1000000000;

      if (bal < commitSOL) 
        return alert('Not enough SOL in your wallet. Minimum funds needed: 1 SOL')

      const transaction = new Transaction().add(
          SystemProgram.transfer({
              fromPubkey: wallet.value.publicKey,
              toPubkey: new PublicKey(masterWallet),
              lamports: commitSOL*1000000000,
              message: number.value})
      )

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, number.value);// processed');

      const pri = await connection.getBalance(new PublicKey(masterWallet))/1000000000;
      prize.value = Math.floor(pri*100)/100;

      await postNumber();

      db.value = await getNumbers();

      updateYourNumbers();
      updateYourProbability();

    }

    async function postNumber () {
      const post = { "id": number.value, "wallet": wallet.value.publicKey.toBase58() }
      const res = await fetch(db_url+'numbers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })
      console.log(res);
      // if (res.status==201)
      //   return alert(`${number.value} commited succefully!`)
      // else
      //   return alert('Number commitment failed! Please try again.')
    }

    async function chechNumber (id) {
      const res = await fetch(db_url+'numbers/'+id)
      if (res.status==200) 
        return false
      return true
    }

    const number = ref('0')
    const nf = Intl.NumberFormat();

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

    async function getWinners () {
      const res = await fetch(db_url+'winners')
      const data = await res.json()
      console.log(data);
      return data;
    }

    const winners = ref({});
    watchEffect(async () => {
      winners.value = await getWinners()
    });

    async function getNumbers () {
      const res = await fetch(db_url+'numbers')
      const data = await res.json()
      const dict = {}
      for (let x of data) {
        dict[Number(x['id'])] = x['wallet']
      }
      return dict
    }

    const db = ref({});
    watchEffect(async () => {
      db.value = await getNumbers()
      console.log(Object.keys(db.value).length);
    });

    function shortWallet (wallet, n) {
      return wallet.slice(0, n)+'...'+wallet.slice(-n)
    }

    // const players = ref(0);
    // function countPlayers () {
    //   for ( const [key, value] of Object.entries(db.value)) {
    //     if (value === address)
    //       arr.push(key);
    //   }
    // }
    
    const yourNumbers = ref(0);
    function updateYourNumbers () {
      const address = wallet.value.publicKey.toBase58();
      const arr = [];
      for ( const [key, value] of Object.entries(db.value)) {
        if (value === address)
          arr.push(key);
      }
      yourNumbers.value = arr.length;
    }

    const yourProbability = ref(0);
    function updateYourProbability () {
      yourProbability.value = Math.floor((yourNumbers.value/Object.keys(db.value).length)*10000)/100;
    }

    watchEffect(async () => {
      updateYourNumbers();
      updateYourProbability();
    });

    function markWallet(address){
      if( wallet.value.publicKey.toBase58() == address ) return 'font-semibold text-green-500';
    }

    function dollarPrize () {
      const ret = nf.format(prize.value*SOL_USD.value).split('.')[0];
      if ( !ret )
        dollarPrize();
      else return ret;
    }
    
    return { 
      dark,
      balance,
      prize,
      SOL_USD,
      commitNumber,
      masterWallet,
      time, 
      clickNum,
      deleteNum,
      resetNum,
      number,
      nf,
      db,
      shortWallet,
      yourNumbers,
      yourProbability,
      markWallet,
      cluster,
      dollarPrize,
      location,
      flag,
      winners,
      deleteTicket,
      getTickets
    }
  },
  data() {
    return {
      commitHover: false
    }
  }
}
</script>

<template>
  <div class="h-screen w-screen m-0 " :class="dark ? 'bg-black/90 text-gray-100' : 'bg-gray-100 text-gray-700'">

    <!-- Navar -->
    <div class="absolute top-0 right-0 p-8 flex space-x-8 justify-center ">
      <!-- Solana Wallets Vue. -->
      <WalletMultiButton :dark="dark"></WalletMultiButton>
      <p :class="dark ? 'text-white' : 'text-gray-600'" class="text-sm font-semibold mt-3" v-if="balance">{{`${balance} SOL`}}</p>
      <button @click="deleteTicket" class="font-bold rounded-full p-2 align-center justify-center relative" 
      :class="dark ? 'bg-black/10 hover:bg-black/20 text-gray-600' : 'bg-black/10 hover:bg-black/20 text-gray-600'">
        <img src="./assets/i.png" alt="Information" width="30" height="30" style="z-index:100; padding:-2px" />
      </button>
      <!-- <button class="font-bold rounded-full p-2 align-center justify-center relative" 
      :class="dark ? 'bg-black/10 hover:bg-black/20 text-gray-600' : 'bg-black/10 hover:bg-black/20 text-gray-600'">
        <a href="https://twitter.com/SOLuckyLotto?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false" ></a>
      </button> -->
      <!-- Dark Button. -->
      
        <button @click="dark = !dark" class="rounded-full p-" :class="dark ? 'bg-white/10 hover:bg-white/20 text-gray-200' : 'bg-black/10 hover:bg-black/20 text-gray-600'">
          <svg v-if="dark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
    </div>

    <div class="flex flex-wrap top-24 left-0 right-0 absolute" :class="dark ? 'bg-black/90 text-gray-100' : 'bg-gray-100 text-gray-700'">


      <!-- Left Panel. -->

      <div class="m-auto w-full max-w-md p-4 min-h-full max-h-full h-full">
        <div class="p-4 text-gray-600 bg-white rounded-xl text-center shadow-xl">
          
          <div class="flex align-center justify-center">
            <div class="p-4 text-center">
              <p class="uppercase text-[17px] tracking-widest text-gray-400 font-semibold">Current prize</p>
              <div class="flex justify-center mr-3 mt-2 p-1" >
                <p class="font-bold text-2xl mt-3 mr-1"
                  :class="dark ? 'text-white' : 'text-gray-600'"
                >◎ </p>
                <p class="font-bold text-4xl mt-2"
                  :class="dark ? 'text-white' : 'text-gray-600'"
                > {{prize}}</p>
              </div>
              <div class="flex justify-center mt-2 pb-1" >
                <p class="font-bold text-xl mt-2 mr-1"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                >$ </p>
                <p class="font-bold text-xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ dollarPrize() }}</p>
              </div>
            </div>
          </div>
          <div class="flex align-center justify-center">
            <div class="p-4 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Numbers</p>
              <div class="flex justify-center" >
                <p class="font-bold text-2xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{yourProbability}}</p>
              </div>
            </div>

            <div class="p-4 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Players</p>
              <div class="flex justify-center" >
                <p class="font-bold text-2xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `${prize}`}}</p>
              </div>
            </div>
          </div>
          <div class="uppercase text-xs mt-3 mb-5 tracking-widest text-gray-400 font-semibold">Current commited numbers</div>
            <lo class="max-h-96 min-h-96 h-96 flex flex-col-reverse flex-grow overflow-y-auto bg-gray-100 p-2 rounded-xl shadow-inner">
              <div v-for="(addr, num) in db" :key="num" >
                <div class="hover:font-semibold grid grid-cols-7 gap-1 flex flex-col-reverse">
                  <img class="opacity-75" src="https://ipdata.co/flags/us.png" alt="{{location}}" width="20"/>
                  <a class="text-left col-span-3" :href="'https://explorer.solana.com/address/'+addr+'?cluster='+cluster" target="_blank" :class="markWallet(addr)">
                    <div class="text-xs">{{ shortWallet(addr, 8) }}</div>
                  </a>
                  <a class="text-center col-span-3" :href="'https://explorer.solana.com/address/'+addr+'?cluster='+cluster" target="_blank" :class="markWallet(addr)">
                    <div class="text-[14px] text-center " :class="markWallet(addr)"> {{ nf.format(num).replaceAll(',', ' ') }}</div>
                  </a>
                </div>
              </div>
            </lo>
        </div>
      </div>

      <!-- Centered. -->
      

      <div class="m-auto w-full max-w-md p-4 min-h-full max-h-full h-full">
        <div class="shadow-xl rounded-xl pt-2 pb-2 " :class="dark ? 'bg-gray-700' : 'bg-white'">

          <div class="text-center uppercase text-sm tracking-widest font-semibold justify-center p-4 mt-8">
            <p class="uppercase text-xl tracking-widest text-gray-400 font-semibold mr-5 mb-2">Prize in</p>
            <CountDown class="text-3xl" :time=time :transform="transformSlotProps" v-slot="{ hours, minutes, seconds }">
              {{ hours }} h {{ minutes }} m {{ seconds }} s
            </CountDown>
          </div>

          <div class="flex align-center justify-center mb-4">
            <div class="p-8 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Probability</p>
              <div class="flex justify-center" >
                <p class="font-bold text-2xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `${yourProbability} %`}}</p>
              </div>
            </div>

            <div class="p-8 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">ROI</p>
              <div class="flex justify-center" >
                <p class="font-bold text-2xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `${yourProbability} %`}}</p>
              </div>
            </div>
          </div>
    
          <div class="uppercase text-s mb-5 tracking-widest text-gray-400 font-semibold text-center">Pick your number</div>

          <div class="font-bold text-4xl text-center p-7 rounded-xl m-2 cursor-pointer"
          :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'"
          @click="commitNumber"
          @mouseover="commitHover=true"
          @mouseleave="commitHover=false">
            <div class="text-2xl py-2 mr-10" v-if="commitHover"><a class="text-gray-400 text-xl mr-5">Commit 🚀 </a>{{nf.format(number)}}</div>
            <div v-else>{{ nf.format(number).replaceAll(',', ' ') }}</div>
          </div>
          
          <div class="grid grid-cols-3 gap-1 text-s font-semibold text-center py-4 px-2 rounded-xl">
            <button @click="clickNum(1)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-tl-xl align-middle relative">1</button>
            <button @click="clickNum(2)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">2</button>
            <button @click="clickNum(3)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-tr-xl align-middle relative">3</button>
            <button @click="clickNum(4)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">4</button>
            <button @click="clickNum(5)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">5</button>
            <button @click="clickNum(6)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">6</button>
            <button @click="clickNum(7)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-bl-xl align-middle relative">7</button>
            <button @click="clickNum(8)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">8</button>
            <button @click="clickNum(9)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-br-xl align-middle relative">9</button>
            <button @click="resetNum()" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-3 px-2 rounded-3xl m-3 align-middle relative">↻</button>
            <button @click="clickNum(0)" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-b-xl align-middle relative">0</button>
            <button @click="deleteNum()" :class="dark ? 'bg-gray-600 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-200'" class="py-3 px-2 rounded-3xl m-3 align-middle relative">⇐</button>          <div/>
          </div>

        </div>
        <!-- <div class="text-sm mt-8">
          <p class="text-xs font-semibold text-gray-400">Your wallet:</p>
          <p>{{ $wallet.publicKey.value?.toBase58() ?? 'Not connected' }}</p>
          <p class="text-xs font-semibold text-gray-400 mt-4">Master wallet:</p>
          <p>{{ masterWallet ?? 'Not created' }}</p>
        </div> -->
      </div>

      <!-- Right Panel -->

      <div class="m-auto w-full max-w-md p-4">
        <div class="p-4 text-gray-600 bg-white rounded-xl text-center shadow-xl">

          <div class="flex align-center justify-center">
            <div class="p-8 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Your numbers</p>
              <div class="flex justify-center" >
                <p class="font-bold text-2xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ yourNumbers }}</p>
              </div>
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold mt-4">Probability</p>
              <div class="flex justify-center" >
                <p class="font-bold text-xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `${yourProbability} %`}}</p>
              </div>
            </div>

            <div class="p-8 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Your numbers</p>
              <div class="flex justify-center" >
                <p class="font-bold text-2xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ yourNumbers }}</p>
              </div>
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold mt-4">Probability</p>
              <div class="flex justify-center" >
                <p class="font-bold text-xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `${yourProbability} %`}}</p>
              </div>
            </div>
          </div>


          <div class="uppercase text-s mb-7 tracking-widest text-gray-400 font-semibold">Historical winners</div>
          <lo class=" max-h-96 min-h-96 h-96 flex flex-col flex-grow overflow-y-auto bg-gray-100 p-2 rounded-xl  shadow-inner">
            <div v-for="x of winners" :key="x.id" >
              <div class="hover:font-semibold grid grid-cols-10 gap-1 flex justify-center align-center align-middle">
                <div class="text-xs col-span-2 inline-block align-text-center">{{ x.date }}</div>
                <div class="text-xs">{{ flag }}</div>
                <div class="text-xs text-center col-span-2">{{ shortWallet(x.wallet, 4) }}</div>
                <div class="text-xs text-center col-span-3 "> {{ nf.format(x.id).replaceAll(',', ' ') }}</div>
                <div class="text-xs text-center col-span-2 flex"><div class="text-xs mb-3 pr-1"> ◎ </div>{{ x.prize }}</div>
              </div>
            </div>
          </lo>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>

::-webkit-scrollbar {
  width: 10px;

}

::-webkit-scrollbar-track {
  background-color: rgba(187, 187, 187, 0);
  border-radius: 0.75rem;
  margin: 0.1rem;
  border-left: 1px solid rgba(211, 211, 211, 0);
}

::-webkit-scrollbar-thumb {
  border-radius: 0.75rem;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

}

</style>
