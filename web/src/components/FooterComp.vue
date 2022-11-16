<template>
  <div class="p-4 pt-8 text-center text-xs text-gray-400" :class="this.$store.state.dark ? 'bg-gray-900' : 'bg-gray-100'" > 
    <div class="flex justify-center items-center rounded-xl m-4">
      <!-- Server time -->
      <div class="text-center text-md tracking-widest font-semibold justify-center mr-8 text-gray-400">
        {{ time }}<span class="text-xs"> UTC</span>
      </div>
      <!-- Users connected -->
      <div class="text-center text-md tracking-widest font-semibold justify-center mr-8 text-gray-400">
        <span class="text-xs">
          CONNECTED: 
        </span>
        {{ users }}
      </div>
      <!-- Users flag -->
      <div class="text-center text-md tracking-widest font-semibold justify-center mr-8 text-gray-400">
        {{ 0 }}
      </div>
    </div>
    Made with 💓 by Solucky Games © All rights reserved. <br>Built in <a href="https://solana.com/" target="_blank" class="underline">Solana</a> in 2022. Good luck all!
  </div>
</template>

<script>

export default {
  props: [
    'time',
    'users'
  ],
  setup() {
    
  },
}
</script>
