<script>

import { ref, computed, watchEffect } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { Connection, PublicKey, Keypair, clusterApiUrl, SystemProgram, Transaction } from '@solana/web3.js'
import { Program, AnchorProvider } from '@project-serum/anchor'
import { WalletMultiButton, useAnchorWallet, useWallet } from 'solana-wallets-vue'
import CountDown from '@chenfengyuan/vue-countdown';
import idl from './idl.json'
import { Buffer } from 'buffer'
import coinTicker from 'coin-ticker'


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


const programID = new PublicKey(idl.metadata.address)
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
    const provider = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment }))
    const program = computed(() => new Program(idl, programID, provider.value))

    const counterPublicKey = useLocalStorage('counterPublicKey', null);
    const counter = ref(0);
    const prize = ref(0);
    const SOL_USD = ref();
    const balance = ref();

    watchEffect(async () => {
      const pri = await connection.getBalance(new PublicKey(masterWallet))/1000000000;
      prize.value = Math.floor(pri*100)/100;
      coinTicker('bitstamp', 'SOL_USD').then((tick) => { SOL_USD.value = tick.last })
    })

    watchEffect(async () => {
      if (!counterPublicKey.value) return;
      const account = await program.value.account.baseAccount.fetch(counterPublicKey.value)
      counter.value = account.count.toNumber()
      const bal = await connection.getBalance(wallet.value.publicKey)/1000000000;
      balance.value = Math.floor(bal*100)/100;
      
    })

    const createCounter = async () => {
      if (! wallet.value) {
        return alert('Connect your wallet first.')
      }

      const newCounter = Keypair.generate();
      await program.value.rpc.create({
        accounts: {
          baseAccount: newCounter.publicKey,
          user: wallet.value.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [newCounter],
      })
      counterPublicKey.value = newCounter.publicKey;
    }

    const incrementCounter = async () => {
      if (! wallet.value) {
        return alert('Connect your wallet first.')
      } else if (! counterPublicKey.value) {
        return alert('Create a new counter first.')
      }

      await program.value.rpc.increment({
        accounts: {
          baseAccount: counterPublicKey.value
        }
      })
      counter.value += 1
    }

    const { sendTransaction } = useWallet();

    async function commitNumber () {

      if (! wallet.value) {
        return alert('Connect your wallet first!')
      } 

      if ( db.value[number.value] && chechNumber(number.value) )
        return alert('This number is already commited! Try another one.')

      const connection = new Connection(clusterApiUrl(cluster), preflightCommitment)

      const bal = await connection.getBalance(wallet.value.publicKey)/1000000000;

      if (bal < commitSOL) 
        return alert('Not enough SOL in your wallet. Minimum funds needed: 1 SOL')

      const transaction = new Transaction().add(
          SystemProgram.transfer({
              fromPubkey: wallet.value.publicKey,
              toPubkey: new PublicKey(masterWallet),
              lamports: commitSOL*1000000000 })
      )

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, 'processed');

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
    });

    function shortWallet (wallet) {
      return wallet.slice(0, 8)+'...'+wallet.slice(-8)
    }
    
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
      counterPublicKey,
      counter,
      createCounter,
      incrementCounter,
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
      dollarPrize
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
  <div class="h-screen w-screen flex" :class="dark ? 'bg-black/90 text-gray-100' : 'bg-gray-100 text-gray-700'">

    <!-- Top-Right Corner. -->
    <div class="absolute top-0 right-0 p-8 flex space-x-8 justify-center ">

      <!-- Solana Wallets Vue. -->
      <WalletMultiButton :dark="dark"></WalletMultiButton>
      <p :class="dark ? 'text-white' : 'text-gray-600'" class="text-sm font-semibold mt-3" v-if="balance">{{`${balance} SOL`}}</p>

      <!-- Dark Button. -->
      <button @click="dark = !dark" class="rounded-full p-3" :class="dark ? 'bg-white/10 hover:bg-white/20 text-gray-200' : 'bg-black/10 hover:bg-black/20 text-gray-600'">
        <svg v-if="dark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

    </div>

    <div class="absolute top-20 right-0 p-8 flex space-x-8 justify-center z-50 ">

      <div class="shadow-xl rounded-xl mr-3" :class="dark ? 'bg-gray-700' : 'bg-white'">
        
        <div class="flex">
          <div class="p-8 text-center">

            <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Current prize</p>
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

          <div class="p-8 text-center">
            <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Wallet numbers</p>

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

        <div class="flex text-center uppercase text-sm tracking-widest font-semibold mb-7 justify-center">
          <p class="uppercase text-sm tracking-widest text-gray-400 font-semibold mr-5 mb-2">Prize in</p>
        <CountDown :time=time :transform="transformSlotProps" v-slot="{ hours, minutes, seconds }">
          {{ hours }} h {{ minutes }} m {{ seconds }} s
        </CountDown>
      </div>
      </div>
    </div>

    <!-- Top-Left Corner. -->
    <div class="absolute top-0 left-0 p-8 flex space-x-8 justify-center ">

      <!-- Dark Button. -->
      <button class="font-bold rounded-full p-2 align-center justify-center relative" 
      :class="dark ? 'bg-black/10 hover:bg-black/20 text-gray-600' : 'bg-black/10 hover:bg-black/20 text-gray-600'">
        <img src="../assets/i.png" alt="Information" width="30" height="30" style="z-index:100; padding:-2px" />
      </button>

    </div>


    <div class="absolute top-20 left-20 p-8 text-gray-600 ">
      <div class="uppercase text-s mb-3 tracking-widest text-gray-400 font-semibold">Current commited numbers</div>
      <div class="hover:font-semibold" v-for="(addr, num) in db" :key="num" >
        <div class="grid grid-cols-3 gap-1 ">
          <a :href="'https://explorer.solana.com/address/'+addr+'?cluster='+cluster" target="_blank" :class="markWallet(addr)">{{ shortWallet(addr) }}</a>
          <div class="text-center" :class="markWallet(addr)"> {{ nf.format(num).replaceAll(',', ' ') }}</div>
        </div>
      </div>
    </div>


    <!-- Centered. -->

    <div class="m-auto w-full max-w-md p-8">

      <div class="uppercase text-s mb-5 tracking-widest text-gray-400 font-semibold text-center">Pick your number</div>


      <div class="shadow-xl rounded-xl pt-2 pb-2" :class="dark ? 'bg-gray-700' : 'bg-white'">
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

      <div class="text-sm mt-8">
        <p class="text-xs font-semibold text-gray-400">Your wallet:</p>
        <p>{{ $wallet.publicKey.value?.toBase58() ?? 'Not connected' }}</p>
        <p class="text-xs font-semibold text-gray-400 mt-4">Master wallet:</p>
        <p>{{ masterWallet ?? 'Not created' }}</p>
      </div>
    </div>
  </div>
</template>
