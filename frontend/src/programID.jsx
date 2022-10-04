import { ref, computed, watchEffect } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { Connection, PublicKey, Keypair, clusterApiUrl, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { useAnchorWallet, useWallet } from 'solana-wallets-vue';
import idl from './idl.json';
import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;
const programID = new PublicKey(idl.metadata.address);
const preflightCommitment = 'processed';
const masterWallet = '6i1zfRMWVEErVPkH4JUtEBj5PFk2VZgshAENhZi1Dj1k';
export default (await import('vue')).defineComponent({
components: {
WalletMultiButton,
},
setup() {
const dark = ref(false);
const wallet = useAnchorWallet();

const connection = new Connection(clusterApiUrl('devnet'), preflightCommitment);
const provider = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment }));
const program = computed(() => new Program(idl, programID, provider.value));

const counterPublicKey = useLocalStorage('counterPublicKey', null);
const counter = ref(0);
const prize = ref(0);
const balance = ref();

watchEffect(async () => {
if (!counterPublicKey.value)
return;
const account = await program.value.account.baseAccount.fetch(counterPublicKey.value);
counter.value = account.count.toNumber();
const bal = await connection.getBalance(wallet.value.publicKey) / 1000000000;
balance.value = Math.floor(bal * 100) / 100;
const pri = await connection.getBalance(PublicKey(masterWallet)) / 1000000000;
prize.value = Math.floor(pri * 100) / 100;
});


const createCounter = async () => {
if (!wallet.value) {
return alert('Connect your wallet first.');
}

const newCounter = Keypair.generate();
await program.value.rpc.create({
accounts: {
baseAccount: newCounter.publicKey,
user: wallet.value.publicKey,
systemProgram: SystemProgram.programId,
},
signers: [newCounter],
});
counterPublicKey.value = newCounter.publicKey;
};

const incrementCounter = async () => {
if (!wallet.value) {
return alert('Connect your wallet first.');
} else if (!counterPublicKey.value) {
return alert('Create a new counter first.');
}

await program.value.rpc.increment({
accounts: {
baseAccount: counterPublicKey.value
}
});
counter.value += 1;
};

const { sendTransaction } = useWallet();

const sendSOL = async () => {

if (!wallet.value) {
return alert('Connect your wallet first.');
}

const connection = new Connection(clusterApiUrl('devnet'), preflightCommitment);

const transaction = new Transaction().add(
SystemProgram.transfer({
fromPubkey: wallet.value.publicKey,
toPubkey: new PublicKey(masterWallet),
lamports: 1000000000
})
);

const signature = await sendTransaction(transaction, connection);

await connection.confirmTransaction(signature, 'processed');

const bal = await connection.getBalance(wallet.value.publicKey) / 1000000000;
balance.value = Math.floor(bal * 100) / 100;

this.$refs.myId.innerText = this.balance;
console.log(this.$refs.myId.innerText);

};

return {
dark,
counterPublicKey,
counter,
createCounter,
incrementCounter,
balance,
prize,
sendSOL,
masterWallet
};
},
});
const __VLS_options = {
...({
components: {
WalletMultiButton,
},
setup() {
const dark = ref(false);
const wallet = useAnchorWallet();

const connection = new Connection(clusterApiUrl('devnet'), preflightCommitment);
const provider = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment }));
const program = computed(() => new Program(idl, programID, provider.value));

const counterPublicKey = useLocalStorage('counterPublicKey', null);
const counter = ref(0);
const prize = ref(0);
const balance = ref();

watchEffect(async () => {
if (!counterPublicKey.value)
return;
const account = await program.value.account.baseAccount.fetch(counterPublicKey.value);
counter.value = account.count.toNumber();
const bal = await connection.getBalance(wallet.value.publicKey) / 1000000000;
balance.value = Math.floor(bal * 100) / 100;
const pri = await connection.getBalance(PublicKey(masterWallet)) / 1000000000;
prize.value = Math.floor(pri * 100) / 100;
});


const createCounter = async () => {
if (!wallet.value) {
return alert('Connect your wallet first.');
}

const newCounter = Keypair.generate();
await program.value.rpc.create({
accounts: {
baseAccount: newCounter.publicKey,
user: wallet.value.publicKey,
systemProgram: SystemProgram.programId,
},
signers: [newCounter],
});
counterPublicKey.value = newCounter.publicKey;
};

const incrementCounter = async () => {
if (!wallet.value) {
return alert('Connect your wallet first.');
} else if (!counterPublicKey.value) {
return alert('Create a new counter first.');
}

await program.value.rpc.increment({
accounts: {
baseAccount: counterPublicKey.value
}
});
counter.value += 1;
};

const { sendTransaction } = useWallet();

const sendSOL = async () => {

if (!wallet.value) {
return alert('Connect your wallet first.');
}

const connection = new Connection(clusterApiUrl('devnet'), preflightCommitment);

const transaction = new Transaction().add(
SystemProgram.transfer({
fromPubkey: wallet.value.publicKey,
toPubkey: new PublicKey(masterWallet),
lamports: 1000000000
})
);

const signature = await sendTransaction(transaction, connection);

await connection.confirmTransaction(signature, 'processed');

const bal = await connection.getBalance(wallet.value.publicKey) / 1000000000;
balance.value = Math.floor(bal * 100) / 100;

this.$refs.myId.innerText = this.balance;
console.log(this.$refs.myId.innerText);

};

return {
dark,
counterPublicKey,
counter,
createCounter,
incrementCounter,
balance,
prize,
sendSOL,
masterWallet
};
},
}),
};
const __VLS_name = (await import('./__VLS_types.js')).getNameOption({
components: {
WalletMultiButton,
},
setup() {
const dark = ref(false);
const wallet = useAnchorWallet();

const connection = new Connection(clusterApiUrl('devnet'), preflightCommitment);
const provider = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment }));
const program = computed(() => new Program(idl, programID, provider.value));

const counterPublicKey = useLocalStorage('counterPublicKey', null);
const counter = ref(0);
const prize = ref(0);
const balance = ref();

watchEffect(async () => {
if (!counterPublicKey.value)
return;
const account = await program.value.account.baseAccount.fetch(counterPublicKey.value);
counter.value = account.count.toNumber();
const bal = await connection.getBalance(wallet.value.publicKey) / 1000000000;
balance.value = Math.floor(bal * 100) / 100;
const pri = await connection.getBalance(PublicKey(masterWallet)) / 1000000000;
prize.value = Math.floor(pri * 100) / 100;
});


const createCounter = async () => {
if (!wallet.value) {
return alert('Connect your wallet first.');
}

const newCounter = Keypair.generate();
await program.value.rpc.create({
accounts: {
baseAccount: newCounter.publicKey,
user: wallet.value.publicKey,
systemProgram: SystemProgram.programId,
},
signers: [newCounter],
});
counterPublicKey.value = newCounter.publicKey;
};

const incrementCounter = async () => {
if (!wallet.value) {
return alert('Connect your wallet first.');
} else if (!counterPublicKey.value) {
return alert('Create a new counter first.');
}

await program.value.rpc.increment({
accounts: {
baseAccount: counterPublicKey.value
}
});
counter.value += 1;
};

const { sendTransaction } = useWallet();

const sendSOL = async () => {

if (!wallet.value) {
return alert('Connect your wallet first.');
}

const connection = new Connection(clusterApiUrl('devnet'), preflightCommitment);

const transaction = new Transaction().add(
SystemProgram.transfer({
fromPubkey: wallet.value.publicKey,
toPubkey: new PublicKey(masterWallet),
lamports: 1000000000
})
);

const signature = await sendTransaction(transaction, connection);

await connection.confirmTransaction(signature, 'processed');

const bal = await connection.getBalance(wallet.value.publicKey) / 1000000000;
balance.value = Math.floor(bal * 100) / 100;

this.$refs.myId.innerText = this.balance;
console.log(this.$refs.myId.innerText);

};

return {
dark,
counterPublicKey,
counter,
createCounter,
incrementCounter,
balance,
prize,
sendSOL,
masterWallet
};
},
} as const);
function __VLS_template() {
import * as __VLS_types from './__VLS_types.js'; import('./__VLS_types.js');
let __VLS_ctx!: __VLS_types.PickNotAny<__VLS_Ctx, {}> & InstanceType<__VLS_types.PickNotAny<typeof __VLS_component, new () => {}>> & {};
let __VLS_vmUnwrap!: typeof __VLS_options & { components: {}; };
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_component extends { components: infer C; } ? C : {}> & __VLS_types.GlobalComponents & typeof __VLS_vmUnwrap.components & __VLS_types.PickComponents<typeof __VLS_ctx>;
let __VLS_selfComponent!: __VLS_types.SelfComponent<typeof __VLS_name, typeof __VLS_component & (new () => { $slots: typeof __VLS_slots; })>;
let __VLS_components!: typeof __VLS_otherComponents & Omit<typeof __VLS_selfComponent, keyof typeof __VLS_otherComponents>;
__VLS_components['/* __VLS_.SearchTexts.Components */'];
({} as __VLS_types.GlobalAttrs)['/* __VLS_.SearchTexts.GlobalAttrs */'];
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
declare const WalletMultiButton: __VLS_types.ConvertInvalidJsxElement<
'wallet-multi-button' extends keyof typeof __VLS_components ? typeof __VLS_components['wallet-multi-button'] : 'walletMultiButton' extends keyof typeof __VLS_components ? typeof __VLS_components['walletMultiButton'] : 'WalletMultiButton' extends keyof typeof __VLS_components ? typeof __VLS_components['WalletMultiButton'] : 'wallet-multi-button' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx['wallet-multi-button'] : 'walletMultiButton' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx['walletMultiButton'] : 'WalletMultiButton' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx['WalletMultiButton'] : unknown>;
__VLS_components['wallet-multi-button']; __VLS_components.walletMultiButton; __VLS_components.WalletMultiButton;
__VLS_components['wallet-multi-button']; __VLS_components.walletMultiButton; __VLS_components.WalletMultiButton;
__VLS_ctx['wallet-multi-button']; __VLS_ctx.walletMultiButton; __VLS_ctx.WalletMultiButton;
__VLS_ctx['wallet-multi-button']; __VLS_ctx.walletMultiButton; __VLS_ctx.WalletMultiButton;
declare const __VLS_0: __VLS_types.ExtractEmit2<typeof WalletMultiButton>;
/* Completion: Emits */
// @ts-ignore
__VLS_0('/* __VLS_.SearchTexts.Completion.Emit.wallet-multi-button */');
// @ts-ignore
__VLS_0('/* __VLS_.SearchTexts.Completion.Emit.walletMultiButton */');
// @ts-ignore
__VLS_0('/* __VLS_.SearchTexts.Completion.Emit.WalletMultiButton */');
/* Completion: Props */
// @ts-ignore
(<WalletMultiButton /* __VLS_.SearchTexts.Completion.Props.wallet-multi-button */ />);
// @ts-ignore
(<WalletMultiButton /* __VLS_.SearchTexts.Completion.Props.walletMultiButton */ />);
// @ts-ignore
(<WalletMultiButton /* __VLS_.SearchTexts.Completion.Props.WalletMultiButton */ />);
{
<div class={"\u0068\u002d\u0073\u0063\u0072\u0065\u0065\u006e\u0020\u0077\u002d\u0073\u0063\u0072\u0065\u0065\u006e\u0020\u0066\u006c\u0065\u0078"}></div>;

<div class={(__VLS_ctx.dark ? 'bg-black/90 text-gray-100' : 'bg-gray-100 text-gray-700')} />;
[dark,];
{
<div class={"\u0061\u0062\u0073\u006f\u006c\u0075\u0074\u0065\u0020\u0074\u006f\u0070\u002d\u0030\u0020\u0072\u0069\u0067\u0068\u0074\u002d\u0030\u0020\u0070\u002d\u0038\u0020\u0066\u006c\u0065\u0078\u0020\u0073\u0070\u0061\u0063\u0065\u002d\u0078\u002d\u0038\u0020\u006a\u0075\u0073\u0074\u0069\u0066\u0079\u002d\u0063\u0065\u006e\u0074\u0065\u0072"}></div>;

{
<WalletMultiButton dark={(__VLS_ctx.dark)}></WalletMultiButton>;

[dark,];
}
{
<p id={"\u006d\u0079\u0049\u0064"} ref={"\u006d\u0079\u0049\u0064"} class={(__VLS_ctx.dark ? 'text-white' : 'text-gray-600')}></p>;

<p class={"\u0074\u0065\u0078\u0074\u002d\u0073\u0020\u0066\u006f\u006e\u0074\u002d\u0073\u0065\u006d\u0069\u0062\u006f\u006c\u0064\u0020\u006d\u0074\u002d\u0033"} />;
// @ts-ignore
(__VLS_ctx.myId);
[dark, myId,];
(`${__VLS_ctx.balance} SOL`);
[balance,];
}
{
<button class={"\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0066\u0075\u006c\u006c\u0020\u0070\u002d\u0033"}></button>;

<button class={(__VLS_ctx.dark ? 'bg-white/10 hover:bg-white/20 text-gray-200' : 'bg-black/10 hover:bg-black/20 text-gray-600')} />;
const __VLS_7: {
'click': __VLS_types.FillingEventArg<
__VLS_types.GlobalAttrs['onClick']
>;
} = {
click: $event => {
__VLS_ctx.dark = !__VLS_ctx.dark;
}
};
[dark, dark, dark,];
if (__VLS_ctx.dark) {
[dark,];
{
<svg xmlns={"\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0077\u0077\u0077\u002e\u0077\u0033\u002e\u006f\u0072\u0067\u002f\u0032\u0030\u0030\u0030\u002f\u0073\u0076\u0067"} class={"\u0068\u002d\u0036\u0020\u0077\u002d\u0036"} fill={"\u006e\u006f\u006e\u0065"} viewBox={"\u0030\u0020\u0030\u0020\u0032\u0034\u0020\u0032\u0034"} stroke={"\u0063\u0075\u0072\u0072\u0065\u006e\u0074\u0043\u006f\u006c\u006f\u0072"}></svg>;

{
<path strokeLinecap={"\u0072\u006f\u0075\u006e\u0064"} stroke-linecap={"\u0072\u006f\u0075\u006e\u0064"} strokeLinejoin={"\u0072\u006f\u0075\u006e\u0064"} stroke-linejoin={"\u0072\u006f\u0075\u006e\u0064"} strokeWidth={"\u0032"} stroke-width={"\u0032"} d={"\u004d\u0031\u0032\u0020\u0033\u0076\u0031\u006d\u0030\u0020\u0031\u0036\u0076\u0031\u006d\u0039\u002d\u0039\u0068\u002d\u0031\u004d\u0034\u0020\u0031\u0032\u0048\u0033\u006d\u0031\u0035\u002e\u0033\u0036\u0034\u0020\u0036\u002e\u0033\u0036\u0034\u006c\u002d\u002e\u0037\u0030\u0037\u002d\u002e\u0037\u0030\u0037\u004d\u0036\u002e\u0033\u0034\u0033\u0020\u0036\u002e\u0033\u0034\u0033\u006c\u002d\u002e\u0037\u0030\u0037\u002d\u002e\u0037\u0030\u0037\u006d\u0031\u0032\u002e\u0037\u0032\u0038\u0020\u0030\u006c\u002d\u002e\u0037\u0030\u0037\u002e\u0037\u0030\u0037\u004d\u0036\u002e\u0033\u0034\u0033\u0020\u0031\u0037\u002e\u0036\u0035\u0037\u006c\u002d\u002e\u0037\u0030\u0037\u002e\u0037\u0030\u0037\u004d\u0031\u0036\u0020\u0031\u0032\u0061\u0034\u0020\u0034\u0020\u0030\u0020\u0031\u0031\u002d\u0038\u0020\u0030\u0020\u0034\u0020\u0034\u0020\u0030\u0020\u0030\u0031\u0038\u0020\u0030\u007a"} />;
}
}
}
else {
{
<svg xmlns={"\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0077\u0077\u0077\u002e\u0077\u0033\u002e\u006f\u0072\u0067\u002f\u0032\u0030\u0030\u0030\u002f\u0073\u0076\u0067"} class={"\u0068\u002d\u0036\u0020\u0077\u002d\u0036"} fill={"\u006e\u006f\u006e\u0065"} viewBox={"\u0030\u0020\u0030\u0020\u0032\u0034\u0020\u0032\u0034"} stroke={"\u0063\u0075\u0072\u0072\u0065\u006e\u0074\u0043\u006f\u006c\u006f\u0072"}></svg>;

{
<path strokeLinecap={"\u0072\u006f\u0075\u006e\u0064"} stroke-linecap={"\u0072\u006f\u0075\u006e\u0064"} strokeLinejoin={"\u0072\u006f\u0075\u006e\u0064"} stroke-linejoin={"\u0072\u006f\u0075\u006e\u0064"} strokeWidth={"\u0032"} stroke-width={"\u0032"} d={"\u004d\u0032\u0030\u002e\u0033\u0035\u0034\u0020\u0031\u0035\u002e\u0033\u0035\u0034\u0041\u0039\u0020\u0039\u0020\u0030\u0020\u0030\u0031\u0038\u002e\u0036\u0034\u0036\u0020\u0033\u002e\u0036\u0034\u0036\u0020\u0039\u002e\u0030\u0030\u0033\u0020\u0039\u002e\u0030\u0030\u0033\u0020\u0030\u0020\u0030\u0030\u0031\u0032\u0020\u0032\u0031\u0061\u0039\u002e\u0030\u0030\u0033\u0020\u0039\u002e\u0030\u0030\u0033\u0020\u0030\u0020\u0030\u0030\u0038\u002e\u0033\u0035\u0034\u002d\u0035\u002e\u0036\u0034\u0036\u007a"} />;
}
}
}
}
}
{
<div class={"\u006d\u002d\u0061\u0075\u0074\u006f\u0020\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u006d\u0061\u0078\u002d\u0077\u002d\u006d\u0064\u0020\u0070\u002d\u0038"}></div>;

{
<div class={"\u0073\u0068\u0061\u0064\u006f\u0077\u002d\u0078\u006c\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0078\u006c"}></div>;

<div class={(__VLS_ctx.dark ? 'bg-gray-700' : 'bg-white')} />;
[dark,];
{
<div class={"\u0070\u002d\u0038\u0020\u0074\u0065\u0078\u0074\u002d\u0063\u0065\u006e\u0074\u0065\u0072"}></div>;

{
<p class={"\u0075\u0070\u0070\u0065\u0072\u0063\u0061\u0073\u0065\u0020\u0074\u0065\u0078\u0074\u002d\u0078\u0073\u0020\u0074\u0072\u0061\u0063\u006b\u0069\u006e\u0067\u002d\u0077\u0069\u0064\u0065\u0073\u0074\u0020\u0074\u0065\u0078\u0074\u002d\u0067\u0072\u0061\u0079\u002d\u0034\u0030\u0030\u0020\u0066\u006f\u006e\u0074\u002d\u0073\u0065\u006d\u0069\u0062\u006f\u006c\u0064"}></p>;

}
{
<p class={"\u0066\u006f\u006e\u0074\u002d\u0062\u006f\u006c\u0064\u0020\u0074\u0065\u0078\u0074\u002d\u0035\u0078\u006c\u0020\u006d\u0074\u002d\u0032"}></p>;

<p class={(__VLS_ctx.dark ? 'text-white' : 'text-gray-900')} />;
[dark,];
(__VLS_ctx.prize);
[prize,];
}
}
{
<div class={"\u0066\u006c\u0065\u0078"}></div>;

{
<button class={"\u0066\u006c\u0065\u0078\u002d\u0031\u0020\u0070\u0079\u002d\u0034\u0020\u0070\u0078\u002d\u0032\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0062\u0072\u002d\u0078\u006c"}></button>;

<button class={(__VLS_ctx.dark ? 'hover:bg-gray-800' : 'hover:bg-gray-100')} />;
const __VLS_20: {
'click': __VLS_types.FillingEventArg<
__VLS_types.GlobalAttrs['onClick']
>;
} = {
click: (__VLS_ctx.sendSOL)
};
[dark, sendSOL,];
}
}
}
{
<div class={"\u0074\u0065\u0078\u0074\u002d\u0073\u006d\u0020\u006d\u0074\u002d\u0038"}></div>;

{
<p class={"\u0074\u0065\u0078\u0074\u002d\u0078\u0073\u0020\u0066\u006f\u006e\u0074\u002d\u0073\u0065\u006d\u0069\u0062\u006f\u006c\u0064\u0020\u0074\u0065\u0078\u0074\u002d\u0067\u0072\u0061\u0079\u002d\u0034\u0030\u0030"}></p>;

}
{
<p></p>;

(__VLS_ctx.$wallet.publicKey.value?.toBase58() ?? 'Not connected');
[$wallet,];
}
{
<p class={"\u0074\u0065\u0078\u0074\u002d\u0078\u0073\u0020\u0066\u006f\u006e\u0074\u002d\u0073\u0065\u006d\u0069\u0062\u006f\u006c\u0064\u0020\u0074\u0065\u0078\u0074\u002d\u0067\u0072\u0061\u0079\u002d\u0034\u0030\u0030\u0020\u006d\u0074\u002d\u0034"}></p>;

}
{
<p></p>;

(__VLS_ctx.masterWallet ?? 'Not created');
[masterWallet,];
}
}
}
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
declare var __VLS_slots: {};
return __VLS_slots;
}
let __VLS_component!: typeof import('./App.vue')['default'];
