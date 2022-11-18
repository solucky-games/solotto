<template>
  <div class="z-20 h-min-screen opcaity-80 py-12 bg-transparent"
    :class="this.$store.state.dark ? 'bg-black/20' : 'bg-white/20'">
    <div  :class="this.$store.state.dark ? 'hidden' : ''"  class="justify-center align-center items-center px-4 md:px-[550px]">
      <a class="twitter-timeline" href="https://twitter.com/solucky__games?ref_src=twsrc%5Etfw">Tweets by solucky__games</a>
    </div>
    <div  :class="this.$store.state.dark ? '' : 'hidden'"  class="justify-center align-center items-center px-4 md:px-[550px]">
      <a class="twitter-timeline" data-theme="dark" href="https://twitter.com/solucky__games?ref_src=twsrc%5Etfw">Tweets by solucky__games</a>
     
  </div>



  </div>

</template>


<script>


export default {
  name: 'SocialSection',
  components: {


  },
  data() {



  },
  


 
}


</script>

<style scoped>


</style>
