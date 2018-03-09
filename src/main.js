// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as firebase from 'firebase'
import VueSession from 'vue-session'
import { store } from './store'
import '../node_modules/vuetify/src/stylus/app.styl'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VTextField,
  VDivider,
  VJumbotron,
  VCard,
    VBottomSheet,
    VSubHeader,
    VAvatar,
    VMenu,
  transitions
} from 'vuetify'

Vue.use(VueSession, {persist:true})
Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VTextField,
    VDivider,
    VJumbotron,
    VCard,
      VBottomSheet,
      VSubHeader,
      VAvatar,
      VMenu,
    transitions
  }
})

Vue.prototype.$logged = false
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
    store,
  components: { App },
  template: '<App/>',
    created () {
        firebase.initializeApp({
            apiKey: 'AIzaSyBdOYlNz9Rdk1lDfbluFvIe-HostsmgyfU',
            authDomain: 'socialriders-2ad62.firebaseapp.com',
            databaseURL: 'https://socialriders-2ad62.firebaseio.com',
            projectId: 'socialriders-2ad62',
            storageBucket: 'socialriders-2ad62.appspot.com',
        })
    }
})
