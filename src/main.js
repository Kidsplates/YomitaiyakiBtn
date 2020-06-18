import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// Peer
import VuePeerJS from 'vue-peerjs'
import Peer from 'peerjs'
Vue.use(VuePeerJS, new Peer({}, {store}))

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
