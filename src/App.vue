<template>
  <div id="app">
   <!-- <keep-alive> -->
     <router-view></router-view>
   <!-- </keep-alive> -->
  </div>
</template>

<script>
// import HelloWorld from './views/hello-world.vue'

export default {
  name: 'app',
  components: {
    // HelloWorld
  }
}
</script>

<style>
*{
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
