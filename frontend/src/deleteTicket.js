

import { computed } from 'vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider } from '@project-serum/anchor'
import idl from './idl.json'
import { getTickets } from './getTickets'

const clusterUrl = "https://api.devnet.solana.com"
const preflightCommitment = 'processed'
const commitment = 'processed'
const programID = new PublicKey(idl.metadata.address)


export const deleteTicket = async () => {
  const wallet = useAnchorWallet()
  const connection = new Connection(clusterUrl, commitment)
  const provider = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment, commitment }))
  const program = computed(() => new Program(idl, programID, provider.value))
  const tickets = await getTickets();

  console.log(tickets)
  const ticket = tickets[0]

  await program.value.rpc.deleteTickets({
      accounts: {
        ticket: ticket.publicKey,
        owner: wallet.value.publicKey,
      },
  })
};