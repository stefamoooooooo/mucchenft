import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "3ec5f37ccb7e55ef9b0f",
  "9d5f0260bc37ea5eee09dea4f1abbd7080cf16395e02d1ab3fbf848e42867a98"
);

new Vue({
  router,
  store,
  vuetify,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
