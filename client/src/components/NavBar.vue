<template>
  <header class="sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3">
    <div class="flex items-center justify-between px-4 py-3 sm:p-0">
      <div>
        <img class="h-8" src="../assets/logo.png" alt="Workcation">
      </div>
      <div class="sm:hidden">
        <button @click="isOpen = !isOpen" type="button" class="block text-gray-500 hover:text-white focus:text-white focus:outline-none">
          <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path v-if="isOpen" fill-rule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>
            <path v-if="!isOpen" fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
          </svg>
        </button>
      </div>
    </div>
    <nav :class="isOpen ? 'block' : 'hidden'" class="px-2 pt-2 pb-4 sm:flex sm:p-0">
      <!-- Wallet Connect -->
      <wallet-multi-button></wallet-multi-button>
      <div class="flex justify-center items-center">
        <!-- Twitter Button -->
        <a :href="twitter_url" target="_blank">
          <button class="rounded-full h-10 w-10 m-2 flex justify-center items-center" :class="dark ? 'bg-white/10 hover:bg-white/20 text-gray-200' : 'bg-black/10 hover:bg-black/20 text-gray-600'" @mouseover="twitter_img=twitter_gif" @mouseleave="twitter_img=require('../assets/ico/twitter.svg')">
            <img :src="twitter_img" class="h-8 w-8"/>
          </button>
        </a>
        <!-- Discord Button -->
        <a :href="discord_url" target="_blank">
          <button class="rounded-full h-10 w-10 m-2 flex justify-center items-center" :class="dark ? 'bg-white/10 hover:bg-white/20 text-gray-200' : 'bg-black/10 hover:bg-black/20 text-gray-600'" @mouseover="discord_img=discord_gif" @mouseleave="discord_img=require('../assets/ico/discord.png')">
            <img :src="discord_img" class="h-8 w-8"/>
          </button>
        </a>
        <!-- Dark Button -->
        <button class="rounded-full h-8 w-8 m-2 flex justify-center items-center ml-4" @click="dark = !dark" :class="dark ? 'bg-white/10 hover:bg-white/20 text-gray-200' : 'bg-black/10 hover:bg-black/20 text-gray-600'">
          <svg v-if="dark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    
    </nav>
  </header>
</template>

<script>
import { WalletMultiButton } from 'solana-wallets-vue';


export default {
  data() {
    return {
      isOpen: false,
      dark: true,
      twitter_img: require("../assets/ico/twitter.svg"),
      twitter_gif: require("../assets/ico/twitter.gif"),
      twitter_url: process.env.VUE_APP_TWITTER_URL,
      discord_img: require("../assets/ico/discord.png"),
      discord_gif: require("../assets/ico/discord.gif"),
      discord_url: process.env.VUE_APP_TWITTER_URL
    }
  },
  components: {
    WalletMultiButton
  }
}
</script>
