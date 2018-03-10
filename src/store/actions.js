import firebase from 'firebase'
import firestore from 'firebase/firestore'

export default {
    signIn ({commit}, providedProvider) {
        var provider;

        if (providedProvider === 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
        } else if (providedProvider === 'facebook') {
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

            // TODO: display error in dialog
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
    }
}