import * as firebase from 'firebase'

export default {
    state: {
        user: null,
    },

    getters: {
        user (state) {
            return state.user
        },
        userIsAuthenticated (state) {
            return state.user !== null && state.user !== undefined
        },
    },

    mutations: {
        setUser (state, user) {
            state.user = user
        },
    },

    actions: {
        signIn ({commit, dispatch}, providedProvider) {
            commit('setLoading', true)

            var provider;

            if (providedProvider === 'google') {
                provider = new firebase.auth.GoogleAuthProvider();
            } else if (providedProvider === 'facebook') {
                provider = new firebase.auth.FacebookAuthProvider();
            } else {
                return
            }

            firebase.auth().signInWithPopup(provider).then(function (result) {
                commit('setLoading', false)
                commit('clearMessage')

                // This gives you a Google Access Token. You can use it to access the Google API.
                const token = result.credential.accessToken

                const user = {
                    uid: result.user.uid,
                    email: result.user.email,
                    name: result.user.displayName,
                    photoUrl: result.user.photoURL
                }

                dispatch('registerIfNewUser', user)
                commit('setUser', user)
            }).catch(function (error) {
                commit('setLoading', false)
                commit('setMessage', {text:error.message, type: 'error'})
            });
        },
        registerIfNewUser({commit}, user) {
            commit('setLoading', true)
            commit('clearMessage')

            firebase.firestore()
                .collection('users')
                .where("uid", "==", user.uid)
                .get()
                .then((docRef) => {
                    // Did not found a existing user matching this uid
                    if (docRef.empty) {
                        firestore()
                            .collection('users')
                            .add(user)
                            .then((docRef) => {
                                commit('setLoading', false)
                                console.log('New user added to firestore!')
                            })
                            .catch((error) => {
                                commit('setMessage', {text: error.message, type: 'error'})
                            })
                    }
                })
                .catch((error) => {
                    commit('setMessage', {text: error.message, type: 'error'})
                })
        },
        autoSignIn ({commit}, user) {
            commit('setUser', {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoUrl: user.photoURL
            })
        },
        logout ({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
        },
    }
}