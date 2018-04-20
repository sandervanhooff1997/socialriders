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
            db.collection('/explores')
                .where('date', '<', new Date())
                .orderBy('date', 'desc')
                .onSnapshot((querySnapshot) => {
                    const experiences = []

                    querySnapshot.forEach(function(doc) {
                        let experience = doc.data()
                        experience.id = doc.id

                        experiences.push(experience)
                    });

                    commit('setExperiences', experiences)
                }, (error) => {
                    commit('clearMessage')
                    commit('setMessage', {text:error.message, type: 'error'
                    })
                })
        },
        getExperiencesByUser({commit}, uid) {
            commit('setLoading', true)
            commit('clearMessage')

            return new Promise ((resolve, reject) => {
                db.collection('/explores')
                    .where('date', '<', new Date())
                    .where('owner.uid', '==', uid)
                    .onSnapshot((querySnapshot) => {
                        commit('setLoading', false)

                        const experiences = []

                        querySnapshot.forEach(function(doc) {
                            let experience = doc.data()
                            experience.id = doc.id

                            experiences.push(experience)
                        });

                        resolve(experiences)
                    }, (error) => {
                        commit('setLoading', false)
                        reject(error.message)
                    })
            })
        },
        getExperience({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('setLoading', true)
                db.collection('/explores')
                    .where(firebase.firestore.FieldPath.documentId(), "==", id)
                    .limit(1)
                    .get()
                    .then(querySnapshot => {
                        commit('setLoading', false)
                        commit('clearMessage')

                        querySnapshot.forEach(function(doc) {
                            let experience = doc.data()
                            experience.id = doc.id

                            resolve(experience);
                        });
                    }, error => {
                        commit('setLoading', false)
                        commit('clearMessage')
                        reject(error)
                    })
            })
        },
    }
}