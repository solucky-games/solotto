<template>
  <!-- Centered. -->

  <div class="m-auto w-full max-w-md p-2">

    <div class="shadow-xl rounded-xl pt-2 pb-2 " :class="dark ? 'bg-gray-800' : 'bg-white'">

      <div class="px-4 text-center mt-8">
        <p class="uppercase text-sm tracking-widest text-gray-400 font-semibold">Commit a</p>
        <p class="uppercase text-3xl tracking-widest text-gray-400 font-semibold">Number</p>

        <div class="text-center uppercase text-sm tracking-widest font-semibold justify-center">
            <div class="flex justify-center mr-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" >
              <div class="uppercase text-xl text-gray-400 font-semibold m-4">Win</div>
              <div class="font-bold text-4xl mt-2" :class="dark ? 'text-gray-200' : 'text-gray-800'"> {{prize}}<span  class="font-bold text-xl mt-4">SOL</span></div>
              <div class="uppercase text-xl text-gray-400 font-semibold m-4">in</div>
            </div>
          <CountDown class="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" :time=time :transform="transformSlotProps" v-slot="{ hours, minutes, seconds }">
            {{ hours }} h {{ minutes }} m {{ seconds }} s
          </CountDown>
        </div>

        <div class="text-center uppercase tracking-widest font-semibold justify-center border-1 rounded-xl pt-4">
          <div class="flex align-center justify-center mb-4">

            <div class="p-4 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Commited</p>
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Numbers</p>
              <div class="flex justify-center" >
                <p class="lowercase font-bold text-xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `x${yourNumbers}`}}</p>
              </div>
            </div>

            <div class="p-4 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Your</p>
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Probability</p>
              <div class="flex justify-center" >
                <p class="font-bold text-xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `${yourProbability}%`}}</p>
              </div>
            </div>

            <div class="p-4 text-center">
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">Your</p>
              <p class="uppercase text-xs tracking-widest text-gray-400 font-semibold">ROI</p>
              <div class="flex justify-center" >
                <p class="font-bold text-xl mt-2"
                  :class="dark ? 'text-gray-300' : 'text-gray-600'"
                > {{ `${nf.format(yourROI)}%`}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="uppercase text-s mb-5 tracking-widest text-gray-400 font-semibold text-center">Pick your number</div>

      <div class="font-bold text-4xl text-center p-7 rounded-xl m-4 cursor-pointer"
      :class="dark ? 'bg-gray-600 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-200'"
      @click="commitNumber"
      @mouseover="commitHover=true"
      @mouseleave="commitHover=false">
        <div class="text-2xl py-2 mr-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" v-if="commitHover">
          <a class="text-xl mr-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Commit 🚀 </a>
          {{nf.format(number)}}
        </div>
        <div v-else>{{ nf.format(number).replaceAll(',', ' ') }}</div>
      </div>
      
      <div class="grid grid-cols-3 gap-1 text-s font-semibold text-center py-4 px-4 rounded-xl">
        <button @click="clickNum(1)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-tl-xl align-middle relative">1</button>
        <button @click="clickNum(2)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">2</button>
        <button @click="clickNum(3)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-tr-xl align-middle relative">3</button>
        <button @click="clickNum(4)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">4</button>
        <button @click="clickNum(5)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">5</button>
        <button @click="clickNum(6)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">6</button>
        <button @click="clickNum(7)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-bl-xl align-middle relative">7</button>
        <button @click="clickNum(8)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 align-middle relative">8</button>
        <button @click="clickNum(9)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-br-xl align-middle relative">9</button>
        <button @click="resetNum()"  :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-3 px-2 rounded-3xl m-3 align-middle relative">↻</button>
        <button @click="clickNum(0)" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-6 px-2 rounded-b-xl align-middle relative">0</button>
        <button @click="deleteNum()" :class="dark ? 'bg-gray-600 hover:bg-gray-400' : 'bg-gray-50 hover:bg-gray-200'" class="py-3 px-2 rounded-3xl m-3 align-middle relative">⇐</button>          <div/>
      </div>

    </div>
  </div>

</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    
  },
})
</script>
