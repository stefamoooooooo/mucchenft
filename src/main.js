import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('076cca4f7dda4eed3a76', '72df3249903924129b0b0890b1a177b8ebd3d2e0e66579820d8baa6285d5d6c2');


new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
