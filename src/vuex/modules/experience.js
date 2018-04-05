import * as firebase from 'firebase'

export default {
    state: {
        experiences: null,
    },

    getters: {
        experiences (state) {
            return state.experiences
        },
    },

    mutations: {
        setExperiences (state, experiences) {
            state.experiences = experiences
        },
    },

    actions: {
        getExperiences({commit}) {
            firebase.firestore()
                .collection('/explores')
                .where('date', '<', new Date())
                .orderBy('date', 'desc')
                .onSnapshot((querySnapshot) => {
                    const experiences = []

                    querySnapshot.forEach(function(doc) {
                        experiences.push(doc.data())
                    });

                    commit('setExperiences', experiences)
                }, (error) => {
                    commit('clearMessage')
                    commit('setMessage', {text:error.message, type: 'error'
                    })
                })
        },
        getExperience({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('setLoading', true)
                firebase.firestore().collection('/explores')
                    .where(firebase.firestore.FieldPath.documentId(), "==", id)
                    .limit(1)
                    .get()
                    .then(querySnapshot => {
                        commit('setLoading', false)
                        commit('clearMessage')
                        querySnapshot.forEach(function(doc) {
                            resolve(doc.data());
                        });

                    }, error => {
                        commit('clearMessage')
                        reject(error)
                    })
            })
        },
    }
}