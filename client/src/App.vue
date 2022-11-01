<template>
  <div class="h-screen w-screen m-0" :class="this.dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'">
    <NavBar @dark="darkMode($event)"/>
    <LeftPanel />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
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

