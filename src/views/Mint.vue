<template>
  <div class="home">
    <!-- <img alt="Mucca dApp" src="../assets/logo.png"> 
    <HelloWorld msg="Welcome to Your Vue.js App"/>-->

    
    <Login/>

  </div>
</template>

<script>
// @ is an alias to /src
import Login from '../components/Login.vue'

export default {
  name: 'Mint',
  components: {
    Login
}
}
</script>
