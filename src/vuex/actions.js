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
            commit('clearError')

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken

            var user = {
                uid: result.user.uid,
                email: result.user.email,
                name: result.user.displayName,
                photoUrl: result.user.photoURL
            }

            commit('setUser', user)
        }).catch(function (error) {
            var errorCode = error.code
            var errorMessage = error.message
            var email = error.email
            var credential = error.credential // firebase.auth.AuthCredential type that was used.

            commit('setLoading', false)
            commit('setError', error)
            console.log(errorMessage)
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
            let explores = []

            querySnapshot.forEach(function(doc) {
                explores.push(doc.data())
            });

            commit('setExplores', explores)
        }).catch(err => {
            console.log("Error fetching explores: " + err.message)
        })
    },
    clearError ({commit}) {
        commit('clearError')
    }
}