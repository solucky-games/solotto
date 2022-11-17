<template>
  <!-- Play Panel. -->

  <div class="m-auto w-[440px] p-4 z-10">

    <div class="rounded-xl pt-2 pb-2 shadow-xl" :class="this.$store.state.dark ? 'bg-black/60 shadow-gray-700' : 'bg-white/60'">
      <!-- Title Box -->
      <div class="px-4 text-center mt-10 text-white">
        <p class="pt-4 uppercase text-xl tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-600"
        :class="this.$store.state.dark ? 'from-yellow-200 to-purple-600' : 'from-purple-600 to-orange-600'">
          DECEMBER 2022
        </p>
        <p class="uppercase text-4xl tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-200"
        :class="this.$store.state.dark ? 'from-yellow-200 to-purple-600' : 'from-purple-600 to-orange-600'">
          COLLECTION
        </p>

        <p class="mt-4 uppercase text-2xl tracking-widest text-white font-bold"
          :class="this.$store.state.dark ? 'text-white' : 'text-black'">
          HAPPY TREEE FRIENDS
        </p>
      </div> 
      <div class="mt-4 text-center uppercase text-sm tracking-widest font-semibold justify-center z-99 w-full p-4">
        <img :src="nft" alt="" class="rounded-full" />
      </div>
      <div class="my-4">
      
      <p class="uppercase text-6xl tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r"
      :class="this.$store.state.dark ? ' from-yellow-400 to-pink-200' : 'from-orange-600 to-pink-600'">
        GIGGLES
      </p>
      <p class="uppercase text-3xl tracking-widest text-white font-bold"
      :class="this.$store.state.dark ? 'text-white' : 'text-black'">
        666 UNIQUE NFTS
      </p>
      <p class="uppercase text-3xl tracking-widest text-white font-bold"
      :class="this.$store.state.dark ? 'text-white' : 'text-black'">
        🔥 0 UTILITY!!! 🔥
      </p>
    </div>

    <div>
      <button class="">I WANT IT!</button>
    </div>
  
    </div>
  </div>

</template>

<script>
import { ref } from 'vue';
import click_sound from '../assets/sounds/click.mp3';
// import store from '@/store';

export default {
  props: [
    'countdown',
    'potSOL',
    'wallet',
    'balance',
    'tickets',
    'yourNumbers',
    'yourProbability',
    'yourROI'
  ],
  methods: {
    commitNumber () {
      this.$emit('commit', this.commitNumber)
    }
  },
  data() {
    const nft = ref('../assets/collections/cherry/x891/9.png');
    setInterval( async function () {
      nft.value = require(`../assets/collections/cherry/x891/${Math.floor(Math.random()*660)}.png`);
      console.log(nft.value)
    }, 500)
    return {
      commitHover: false,
      commiting: false,
      nft
    }
  },
  setup () {

    const number = ref('0')
    const nf = Intl.NumberFormat();
    const maxNumber = 1000000000;
    const audio = new Audio(click_sound);

    // Keyboard functionality
    function clickNum (n) {
      // if ( store.state.sound )
        audio.play();

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
    
    return { 
      clickNum,
      deleteNum,
      resetNum,
      number,
      nf,
      location,
      commitPop,
    }
  }
}
</script>
