<template>
  <div>
    <div class="h-screen w-screen m-0 -mb-12" :class="this.$store.state.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'">
      <NavBar />
      <div class="flex flex-wrap top-24 left-0 right-0" :class="this.$store.state.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'">
        <PotPanel />
        <PlayPanel />
        <HistoryPanel />
      </div>
    </div>
    <!-- <CommitModal class="invisible hidden"/> -->
    
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import PotPanel from './components/PotPanel.vue';
import PlayPanel from './components/PlayPanel.vue';
import HistoryPanel from './components/HistoryPanel.vue';
// import CommitModal from './components/CommitModal.vue';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { initWallet } from 'solana-wallets-vue';
import { initWorkspace } from './services/useWorkspace';

const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
]

initWallet({ wallets, autoConnect: true })
initWorkspace()


export default {
  name: 'App',
  components: {
    NavBar,
    PotPanel,
    PlayPanel,
    HistoryPanel,
    // CommitModal
  }
}
</script>

<style>

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background-color: rgba(129, 129, 129, 0.692);
  border-radius: 0.75rem;
  margin: 0.4rem;
  border-left: 1px solid rgba(211, 211, 211, 0);
}

::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background:  linear-gradient(30deg, #d31bb47c, #ae0ce05d);
  box-shadow: inset 0 0 6px #c41bd3,
}
</style>


