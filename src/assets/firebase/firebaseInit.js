import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'

firebase.initializeApp(firebaseConfig)
export const firebaseApp = firebase
export const firestore = firebase.firestore()