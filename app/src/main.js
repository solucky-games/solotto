import { createApp } from 'vue';
import App from './App.vue';
import SolanaWallets from 'solana-wallets-vue';
import unoverlay from 'unoverlay-vue';

// You can either import the default styles or create your own.
import './styles.css';

import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';


const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network: 'devnet' }),
    new GlowWalletAdapter({ network: 'devnet' }),
    new TorusWalletAdapter(),
    new SolletWalletAdapter({ network: 'devnet' }),
    new SolletExtensionWalletAdapter({ network: 'devnet' }),
  ],
  autoConnect: true,
}

createApp(App)
  .use(SolanaWallets, walletOptions)
  .use(unoverlay)
  .mount('#app');


