<template>
  <div>
  <div class="h-screen w-screen m-0 -mb-12" :class="this.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'">
    <NavBar @dark="darkMode($event)"/>

    <PotPanel />

  </div>
</div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import PotPanel from './components/PotPanel.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    PotPanel
  },
  data() {
    return {
      dark: false,
    }
  },
  methods: {
    darkMode(dark) {
      this.dark = dark
    }
  }
}
</script>

