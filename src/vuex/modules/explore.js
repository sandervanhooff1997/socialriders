import * as firebase from 'firebase'

export default {
    state: {
        explores: null,
    },

    getters: {
        explores (state) {
            return state.explores
        },
    },

    mutations: {
        setExplores (state, explores) {
            state.explores = explores
        },
    },

    actions: {
        getExplores ({commit}) {
            firebase.firestore()
                .collection('/explores')
                .where('date', '>', new Date())
                .onSnapshot((querySnapshot) => {
                    const explores = []

                    querySnapshot.forEach(function(doc) {
                        explores.push(doc.data())
                    });

                    commit('setExplores', explores)
                }, (error) => {
                    commit('clearMessage')
                    commit('setMessage', {text:error.message, type: 'error'
                    })
                })
        },
        organizeExplore({commit}, explore) {
            return new Promise((resolve, reject) => {
                commit('setLoading', true)
                firebase.firestore().collection('/explores').add(explore).then(docRef => {
                    commit('setLoading', false)
                    commit('clearMessage')
                    resolve(docRef);  // Let the calling function know that http is done. You may send some data back
                }, error => {
                    commit('clearMessage')
                    reject(error)
                })
            })
        },
    }
}