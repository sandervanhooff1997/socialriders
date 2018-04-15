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
            commit('setLoading', true)
            commit('clearMessage')
            firebase.firestore()
                .collection('/explores')
                .where('date', '>', new Date())
                .onSnapshot((querySnapshot) => {
                    commit('setLoading', false)

                    const explores = []

                    querySnapshot.forEach(function(doc) {
                        let explore = doc.data()
                        explore.id = doc.id

                        explores.push(explore)
                    });

                    commit('setExplores', explores)
                }, (error) => {
                    commit('setLoading', false)
                    commit('setMessage', {text:error.message, type: 'error'
                    })
                })
        },
        organizeExplore({commit}, explore) {
            return new Promise((resolve, reject) => {
                commit('setLoading', true)
                commit('clearMessage')
                firebase.firestore().collection('/explores').add(explore).then(docRef => {
                    commit('setLoading', false)
                    resolve(docRef);  // Let the calling function know that http is done. You may send some data back
                }, error => {
                    reject(error)
                })
            })
        },
    }
}