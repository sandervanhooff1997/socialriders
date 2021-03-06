export default {
    state: {
        explores: null,
        maxDistance: null,
        maxDuration: null
    },

    getters: {
        explores (state) {
            return state.explores
        },
        maxDistance(state) {
            return state.maxDistance
        },
        maxDuration(state) {
            return state.maxDuration
        }
    },

    mutations: {
        setExplores (state, explores) {
            state.explores = explores
        },
        setMaxDistance (state, maxDistance) {
            state.maxDistance = maxDistance
        },
        setMaxDuration (state, maxDuration) {
            state.maxDuration = maxDuration
        },
        deleteExplore(state, explore) {
            state.explores.splice(explore, 1)
        }
    },

    actions: {
        getExplores ({commit}) {
            commit('setLoading', true)

            return new Promise((resolve, reject) => {
                db.collection('/explores')
                    .where('date', '>', new Date())
                    .onSnapshot((querySnapshot) => {
                        commit('setLoading', false)

                        const explores = []

                        querySnapshot.forEach(function (doc) {
                            let explore = doc.data()
                            explore.id = doc.id

                            explores.push(explore)
                        });

                        commit('setExplores', explores)
                        resolve(explores)
                    }, error => {
                        commit('setLoading', false)
                        commit('clearMessage')
                        commit('setMessage', {
                            text: error.message, type: 'error'
                        })
                        reject()
                    })
            })
        },
        getExploresByUser({commit}, uid) {
            commit('setLoading', true)

            return new Promise ((resolve, reject) => {
                db.collection('/explores')
                    .where('date', '>', new Date())
                    .where('owner.uid', '==', uid)
                    .onSnapshot((querySnapshot) => {
                        commit('setLoading', false)

                        const explores = []

                        querySnapshot.forEach(function(doc) {
                            let explore = doc.data()
                            explore.id = doc.id

                            explores.push(explore)
                        });

                        resolve(explores)
                    }, error => {
                        commit('setLoading', false)
                        commit('clearMessage')
                        reject(error.message)
                    })
            })
        },
        organizeExplore({commit}, explore) {
            commit('setLoading', true)

            return new Promise((resolve, reject) => {
                db.collection('/explores')
                    .add(explore)
                    .then(docRef => {
                        commit('setLoading', false)
                        commit('clearMessage')
                        resolve(docRef);
                }, error => {
                    commit('clearMessage')
                    reject(error)
                })
            })
        },
        editExplore({commit}, explore) {
            commit('setLoading', true)

            return new Promise((resolve, reject) => {
                db.collection('/explores')
                    .doc(explore.id)
                    .set(explore)
                    .then(docRef => {
                        commit('setLoading', false)
                        commit('clearMessage')
                        resolve(docRef);
                }, error => {
                    commit('clearMessage')
                    reject(error)
                })
            })
        },
        joinExplore({commit}, payload) {
            let docRef = firebase.firestore().collection('explores').doc(payload.id)
            commit('setLoading', true)
            commit('clearMessage')

            return new Promise((resolve, reject) => {
                db.runTransaction(function (transaction) {
                    // This code may get re-run multiple times if there are conflicts.
                    return transaction
                        .get(docRef)
                        .then(function (doc) {
                            commit('setLoading', false)

                            if (!doc.exists) {
                                reject('Trip does not exists')
                            }

                            let riders = doc.data().riders
                            riders.push(payload.user)

                            transaction.update(docRef, {riders: riders})
                        });
                }).then(function () {
                    resolve('Joined trip!')
                }).catch(function (error) {
                    commit('setLoading', false)
                    reject('Failed to join trip: ' + error)

                })
            })
        },
        leaveExplore({commit}, payload) {
            let docRef = firebase.firestore().collection('explores').doc(payload.id)
            commit('setLoading', true)
            commit('clearMessage')

            return new Promise((resolve, reject) => {
                db.runTransaction(function (transaction) {
                    // This code may get re-run multiple times if there are conflicts.
                    return transaction
                        .get(docRef)
                        .then(function (doc) {
                            commit('setLoading', false)

                            if (!doc.exists) {
                                reject('Trip does not exists')
                            }

                            let riders = doc.data().riders
                            riders = riders.filter(rider => {
                                return rider.uid !== payload.uid
                            })

                            transaction.update(docRef, {riders: riders})
                        });
                }).then(function () {
                    resolve('You left this trip!')
                }).catch(function (error) {
                    commit('setLoading', false)
                    reject('Failed to leave trip: ' + error)

                })
            })
        },
        deleteExplore({commit}, explore) {
            commit('setLoading', true)
            commit('clearMessage')

            return new Promise((resolve, reject) => {
                firebase.firestore()
                    .collection('explores')
                    .doc(explore.id)
                    .delete()
                    .then(() => {
                        commit('setLoading', false)
                        commit('deleteExplore', explore)
                        resolve()
                    })
                    .catch(error => {
                        commit('setLoading', false)
                        reject(error)
                    })
            })
        },
        getMaxDistance ({commit}) {
            return new Promise ((resolve, reject) => {
                db.collection('explores')
                    .orderBy('distance', 'desc')
                    .limit(1)
                    .get()
                    .then(querySnapshot => {
                        if (querySnapshot.empty) {
                            reject({message: 'No trips found'})
                        }

                        let maxDistance = querySnapshot.docs[0].data().distance
                        maxDistance = (Math.round((maxDistance/1000) * 10 ) / 10).toFixed(1)

                        commit('setMaxDistance', maxDistance)
                        resolve(maxDistance)
                    }).catch(error => {
                        reject(error)
                    })
            })
        },
        getMaxDuration ({commit}) {
            return new Promise ((resolve, reject) => {
                db.collection('explores')
                    .orderBy('duration', 'desc')
                    .limit(1)
                    .get()
                    .then(querySnapshot => {
                        if (querySnapshot.empty) {
                            reject({message: 'No trips found'})
                        }

                        let maxDuration = querySnapshot.docs[0].data().duration
                        maxDuration = parseInt(maxDuration, 10)
                        maxDuration = Math.floor(maxDuration / 3600)

                        commit('setMaxDuration', maxDuration)
                        resolve(maxDuration)
                    }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}