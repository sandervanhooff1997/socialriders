// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSession from 'vue-session'
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
    transitions
  }
})

Vue.prototype.$logged = false
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
