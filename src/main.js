/**
 * Imports
 */
import 'vuetify/dist/vuetify.min.css'
import '@/assets/css/style.css'
import '@/assets/css/theme.css'
import '@/assets/css/theme-overrides.css'
import '@/assets/filters/filters'
import Vue from 'vue'
import App from './App'
import router from './router/router'
import Vuetify from 'vuetify'
import { firebaseApp, firestore } from '@/assets/firebase/firebaseInit'
import { store } from './vuex/vuex'
import AlertCmp from './components/shared/Alert'
import LoaderCmp from './components/shared/Loader'
import jQuery from 'jquery'

/**
 * Global usages
 */
Vue.use(Vuetify, {
    theme: {
        primary: '#1de9b6',
        secondary: '#8e24aa',
        accent: '#8093FA',
        error: '#FF5252',
        info: '#0288d1',
        success: '#43A047',
        warning: '#ff6e40'
    }
})

window.firebase = firebaseApp
window.db = firestore
window.Event = new Vue();
window.$ = window.jQuery = jQuery

/**
 * Global components
 */
Vue.component('app-alert', AlertCmp)
Vue.component('loader', LoaderCmp)

/**
 * Vue production tips in console
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
        firebase.auth().onAuthStateChanged(authUser => {
            if (authUser) {
                this.$store.dispatch('autoSignIn', authUser)
            }
        });
    }
})