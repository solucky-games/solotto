<template>
  <!-- Play Panel. -->

  <div class="m-auto w-full max-w-xl p-4 z-99">

    <div class="rounded-xl pt-2 pb-2 shadow-xl" :class="this.$store.state.dark ? 'bg-black/60 shadow-gray-700' : 'bg-white/60'">
      <!-- Title Box -->
      <div class="px-4 text-center mt-10 text-white">
        <p class="uppercase text-xll tracking-widest text-whitefont-semibold">Meet our happy a</p>
        <p class="uppercase text-3xl tracking-widest text-white font-semibold">Friends</p>
        <div class="text-center uppercase text-sm tracking-widest font-semibold justify-center z-99 m-6">
          <img :src="nft" :alt="nft" class="rounded-full" />
        </div>

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
