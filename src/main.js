/**
 * Imports
 */
import Vue from 'vue'
import App from './App'
import router from './router/router'
import Vuetify from 'vuetify'
import * as firebase from 'firebase'
import localForage from 'localforage'
import { store } from './store/store'
import AlertCmp from './components/shared/Alert'
import 'vuetify/dist/vuetify.min.css'
import './styles/overrides.css'

/**
 * Global usages
 */
Vue.use(localForage)
Vue.use(Vuetify)

/**
 * Global components
 */
Vue.component('app-alert', AlertCmp)

/**
 * Production tips in console turned off
 */
Vue.config.productionTip = false

/**
 * The global Vue instance
 */
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

      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.$store.dispatch('autoSignIn', user)
        }
      });
  }
})
