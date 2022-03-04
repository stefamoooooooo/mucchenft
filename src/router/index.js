import Vue from 'vue'
import VueRouter from 'vue-router'
import Mint from '../views/Mint.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Mint',
    component: Mint
  },
  {
    path: '/buy',
    name: 'Buy',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Buy.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
