import firebase from 'firebase'
import firestore from 'firebase/firestore'

export default {
    signIn ({commit}, providedProvider) {
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

            commit('setUser', user)
        }).catch(function (error) {
            commit('setLoading', false)
            commit('setMessage', {text:error.message, type: 'error'})
        });
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
    fetchExplores ({commit}) {
        firebase.firestore().collection('/explores').get().then(querySnapshot => {
            commit('clearMessage')
            const explores = []

            querySnapshot.forEach(function(doc) {
                explores.push(doc.data())
            });

            commit('setExplores', explores)
        }).catch(error => {
            commit('setMessage', {text:error.message, type: 'error'})
        })
    },
    organizeExplore({commit}, explore) {
        commit('setLoading', true)
        firebase.firestore().collection('/explores').add(explore).then((docRef) => {
            commit('setLoading', false)
            commit('clearMessage')
            commit('setMessage', {text:'Explore Organized!', type: 'success'})
            return true
        }).catch((error) => {
            commit('setMessage', {text:error.message, type: 'error'})
        })
    },
    clearMessage ({commit}) {
        commit('clearMessage')
    }
}