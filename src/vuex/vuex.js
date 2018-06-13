import Vue from 'vue'
import Vuex from 'Vuex'
import experienceModule from './modules/experience'
import exploreModule from './modules/explore'
import userModule from './modules/user'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loading: false,
        message: false
    },

    getters: {
        loading (state) {
            return state.loading
        },
        message (state) {
            return state.message
        }
    },

    mutations: {
        setLoading (state, loading) {
            state.loading = loading
        },
        setMessage (state, message) {
            state.message = message
        },
        clearMessage (state) {
            state.message = null
        }
    },

    actions: {
        errorMessage ({commit}, text) {
            commit('clearMessage')
            commit('setMessage', {type: 'error', text: text})
        },
        successMessage ({commit}, text) {
            commit('clearMessage')
            commit('setMessage', {type: 'success', text: text})
        },
        clearMessage ({commit}) {
            commit('clearMessage')
        }
    },

    modules: {
        experienceModule,
        exploreModule,
        userModule,
    }
})