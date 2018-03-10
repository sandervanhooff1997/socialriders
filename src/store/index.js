import Vue from 'vue'
import Vuex from 'Vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload
        }
    },
    actions: {
        signIn ({commit}, payload) {
            var provider;

            if (payload.provider === 'google') {
                provider = new firebase.auth.GoogleAuthProvider();
            } else if (payload.provider === 'facebook') {
                provider = new firebase.auth.FacebookAuthProvider();
            } else {
                return
            }

            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken

               var user = {
                   email: result.user.email,
                   name: result.user.displayName,
                   photoUrl: result.user.photoURL
               }

               commit('setUser', user)
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code
                var errorMessage = error.message
                // The email of the user's account used.
                var email = error.email
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential

                console.log(errorMessage)
            });
        },
        autoSignIn ({commit}, payload) {
            commit('setUser', {
                email: payload.email,
                name: payload.displayName,
                photoUrl: payload.photoURL
            })
        },
        logout ({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
        },
    },
    getters: {
        user (state) {
            return state.user
        },
        userIsAuthenticated (state) {
            return state.user !== null && state.user !== undefined
        }
    }
})