/**
 * Imports
 */
import 'vuetify/dist/vuetify.min.css'
import '@/assets/css/style.css'
import '@/assets/css/visuals.css'
import '@/assets/filters/filters'
import Vue from 'vue'
import App from './App'
import router from './router/router'
import Vuetify from 'vuetify'
import { firebaseApp, firestore } from '@/assets/firebase/firebaseInit'
import { store } from './vuex/vuex'
import MessageCmp from './components/shared/Message'
import LoaderCmp from './components/shared/Loader'
import jQuery from 'jquery'
import Overdrive from 'vue-overdrive'

/**
 * Global usages
 */
Vue.use(Vuetify, {
    theme: {
        primary: '#F7A000',
        secondary: '#F7A000',
        accent: '#8093FA',
        error: '#FF5816',
        info: '#0288d1',
        success: '#43A047',
        warning: '#FF5816'
    }
})
Vue.use(Overdrive)

window.firebase = firebaseApp
window.db = firestore
window.Event = new Vue();
window.$ = window.jQuery = jQuery
window.screenWidth = window.innerWidth
window.screenHeight = window.innerHeight

/**
 * Global components
 */
Vue.component('app-message', MessageCmp)
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
    },
    mounted () {
        // register screen size
        this.$nextTick(function() {
            window.addEventListener('resize', function(e) {
                window.screenHeight = window.innerHeight
                window.screenWidth = window.innerWidth
            });
        })
    }
})