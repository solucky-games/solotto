import Vuex from 'vuex';
// import { ref, watchEffect } from 'vue';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useAnchorWallet } from 'solana-wallets-vue';
// import { io } from 'socket.io-client';


// const socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);


export default new Vuex.Store({
  state: {
    dark: false,
    balance: 0,
  },
  getters: {

  },
  mutations: {
  },
  actions: {
    darkMode () {
      this.state.dark = !this.state.dark;
    },
    async updateBalance (  ) {
      const wallet = useAnchorWallet();
      const connection = new Connection(clusterApiUrl(process.env.APP_VUE_CLUSTER), 'processed')
      this.state.balance = await connection.getBalance(wallet.value.publicKey)/1000000000;
      console.log('eoooo', this.state.balance);
    },

  }
})