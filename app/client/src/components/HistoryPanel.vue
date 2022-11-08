<template>
  <!-- Right Panel -->

  <div class="m-auto w-full max-w-md p-4">
    <div class="p-4 text-gray-600 rounded-xl text-center shadow-xl" :class="this.$store.state.dark ? 'bg-gray-800' : 'bg-white'">

      <div class="uppercase text-sm tracking-widest text-gray-400 font-semibold mt-8">SOLucky</div>
      <div class="uppercase text-3xl tracking-widest text-gray-400 font-semibold">History</div>
      
      <div class="text-center uppercase text-sm tracking-widest font-semibold justify-center">
        <div class="flex justify-center mr-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" >
          <div class="uppercase text-xl font-semibold m-4">&nbsp;&nbsp; Total</div>
          <div class="font-bold text-4xl mt-2" :class="this.$store.state.dark ? 'text-gray-200' : 'text-gray-800'"> {{'11'}}</div>
          <div class="uppercase text-xl font-semibold m-4">Games</div>
        </div>
      </div>

      <div class="flex align-center justify-center mt-1">

        <div class="p-4 text-center">
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Total</p>
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Countries</p>
          <div class="flex justify-center" >
            <p class="font-bold text-xl mt-2"
              :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
            >{{ ` ${12}` }}</p>
          </div>
        </div>

        <div class="p-4 text-center mr-2">
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Greatest</p>
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Prize</p>
          <div class="flex justify-center" >
            <p class="font-bold text-xl mt-2 mr-4"
              :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
            > <span class="text-sm text-gray-400">◎ </span>{{ ` ${323}` }}</p>
          </div>
        </div>

        <div class="p-4 text-center">
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Average</p>
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Number</p>
          <div class="flex justify-center" >
            <p class="font-bold text-md pt-2 mt-1"
              :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
            > {{ nf.format(9044309).replaceAll(',', ' ') }}</p>
          </div>
        </div>
      </div>

      <div class="flex align-center justify-center">

        <div class="p-4 text-center">
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Total</p>
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Countries</p>
          <div class="flex justify-center" >
            <p class="font-bold text-xl mt-2"
              :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
            >{{ ` ${12}` }}</p>
          </div>
        </div>

        <div class="p-4 text-center mr-2">
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Greatest</p>
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Prize</p>
          <div class="flex justify-center" >
            <p class="font-bold text-xl mt-2 mr-4"
              :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
            > <span class="text-sm text-gray-400">◎ </span>{{ ` ${323}` }}</p>
          </div>
        </div>

        <div class="p-4 text-center">
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Average</p>
          <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Number</p>
          <div class="flex justify-center" >
            <p class="font-bold text-md pt-2 mt-1"
              :class="this.$store.state.dark ? 'text-gray-300' : 'text-gray-600'"
            > {{ nf.format(9044309).replaceAll(',', ' ') }}</p>
          </div>
        </div>
      </div>

      <div class="uppercase text-xs mb-4 mt-4 tracking-widest text-gray-400 font-semibold">Historical winners</div>

      <lo class=" max-h-96 min-h-96 h-96 flex flex-col flex-grow overflow-y-auto bg-gray-100 p-2 rounded-xl shadow-inner" :class="this.$store.state.dark ? 'bg-gray-700' : 'bg-text-gray-200'">
        <div v-for="x of winners" :key="x.id" >
          <div class="hover:font-semibold grid grid-cols-12 justify-center align-center align-middle"  :class="this.$store.state.dark ? 'text-gray-200' : 'bg-text-gray-800'">
            <div class="text-xs text.left   col-span-3">{{ x.date }}</div>
            <div class="text-xs text-right col-span-2 font-semibold flex text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"><div class="text-xs mb-3 pl-1 pr-1"> ◎ </div>{{ x.prize }}</div>
            <div class="text-xs text-left col-span-3">{{ shortWallet(x.wallet, 4) }}</div>
            <div class="text-xs text-center col-span-1">{{ x.country }}</div>
            <div class="text-xs text-center col-span-3"> {{ nf.format(x.id).replaceAll(',', ' ') }}</div>
          </div>
        </div>
      </lo>
    </div>
  </div>

</template>

<script>
import { ref, watchEffect } from 'vue';

const nf = Intl.NumberFormat();

export default {
  setup () {

    async function getWinners () {
      const res = await fetch(process.env.VUE_APP_DB_WINNERS_URL+'winners')
      const data = await res.json()
      return data;
    }

    const winners = ref({});
    watchEffect(async () => {
      winners.value = await getWinners()
    });

    return { 
      winners,
      nf
    }
  }
}
</script>
