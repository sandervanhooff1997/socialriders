/**
 * Imports
 */
import Vue from 'vue'
import App from './App'
import router from './router/router'
import Vuetify from 'vuetify'
import * as firebase from 'firebase'
import { store } from './vuex/store'
import AlertCmp from './components/shared/Alert'
import 'vuetify/dist/vuetify.min.css'
import './styles/overrides.css'
import Moment from 'moment'

/**
 * Global usages
 */
Vue.use(Vuetify, {
    theme: {
        primary: '#6C0CE8',
        secondary: '#0288D1',
        accent: '#82B1FF',
        error: '#FF0000',
        info: '#0288D1',
        success: '#4CAF50',
        warning: '#FFFF0D'
    }
})

window.Event = new Vue();

/**
 * Global components
 */
Vue.component('app-alert', AlertCmp)

/**
 * Production tips in console turned off
 */
Vue.config.productionTip = false

Vue.filter('date-format', function (date) {
    return Moment(date).format('MMMM Do YYYY')
})

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

        firebase.auth().onAuthStateChanged(authUser => {
            if (authUser) {
                this.$store.dispatch('autoSignIn', authUser)
            }
        });
    }
})