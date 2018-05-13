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
            commit('setLoading', true)

            return new Promise ((resolve, reject) => {
                db.collection('/explores')
                    .where('date', '<', new Date())
                    .orderBy('date', 'desc')
                    .onSnapshot((querySnapshot) => {
                        commit('setLoading', false)
                        const experiences = []

                        querySnapshot.forEach(function (doc) {
                            let experience = doc.data()
                            experience.id = doc.id

                            experiences.push(experience)
                        });

                        commit('setExperiences', experiences)
                        resolve()
                    }, (error) => {
                        commit('setLoading', false)
                        commit('clearMessage')
                        commit('setMessage', {
                            text: error.message, type: 'error'
                        })
                        reject()
                    })
            })
        },
        getExperiencesLimited({commit}, limit) {
            commit('setLoading', true)

            return new Promise ((resolve, reject) => {
                db.collection('/explores')
                    .where('date', '<', new Date())
                    .orderBy('date', 'desc')
                    .limit(limit)
                    .onSnapshot((querySnapshot) => {
                        commit('setLoading', false)
                        const experiences = []

                        querySnapshot.forEach(function (doc) {
                            let experience = doc.data()
                            experience.id = doc.id

                            experiences.push(experience)
                        });

                        resolve(experiences)
                    }, (error) => {
                        commit('setLoading', false)
                        commit('clearMessage')
                        commit('setMessage', {
                            text: error.message, type: 'error'
                        })
                        reject()
                    })
            })
        },
        getExperiencesByUser({commit}, uid) {
            commit('setLoading', true)

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
                        commit('clearMessage')
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
        deleteMediaFromDownloadURLs({}, mediaURLs) {
            // deletes firebase files based on the file downloadURL
            return new Promise((resolve, reject) => {
                if (mediaURLs.length > 0) {
                    for (let i = 0;i < mediaURLs.length; i++) {
                        let mediaRef = firebase.storage().refFromURL(mediaURLs[i])
                        mediaRef.delete().then(function() {
                            // only resolve if the last item succeeded
                            if (i === mediaURLs.length - 1) {
                                resolve()
                            }
                        }).catch(function(error) {
                            console.log(error)
                            reject(error)
                        });
                    }
                } else {
                    resolve()
                }
            })
        },
        uploadMedia ({dispatch}, payload) {
            let data = {
                id: payload.id,
                mediaURLs: []
            }

            return new Promise((resolve, reject) => {
                // delete previous media uploads
                dispatch('deleteMediaFromDownloadURLs', payload.previousMediaURLs).then(() => {
                    // next upload new images to Firebase storage
                    payload.images.forEach(image => {
                        const ext = image.name.split('.').pop()
                        // must be unique to prevend overrides
                        const filename = new Date().getTime() + '-' + Math.random()*1000000 + '.' + ext

                        // upload to the latest ref
                        firebase.storage()
                            .ref('experiences/' + payload.id + '/' + filename)
                            .put(image)
                            .then(fileData => {
                                // save the imageURLs to update explore in database later on
                                data.mediaURLs.push(fileData.downloadURL)

                                // if all images are uploaded
                                if (data.mediaURLs.length === payload.images.length) {
                                    dispatch('updateExperienceMedia', data).then(mediaUploads => {
                                        resolve(mediaUploads)
                                    }, error => {
                                        reject(error)
                                    })
                                }
                            })
                    })
                }, error => {
                    console.log(error)
                    reject(error)
                })
            })
        },
        updateExperienceMedia ({commit, getters, dispatch}, payload) {
            // update explore with the new mediaURLs pointing to the files
            let docRef = firebase.firestore().collection('explores').doc(payload.id)
            let mediaUploads = []

            return new Promise((resolve, reject) => {
                db.runTransaction(function (transaction) {
                    // This code may get re-run multiple times if there are conflicts.
                    return transaction
                        .get(docRef)
                        .then(function (doc) {
                            if (!doc.exists) {
                                reject('Experience does not exists')
                            }

                            // create the data model
                            let experience = doc.data()
                            let mediaUploadData = {
                                user: getters.user,
                                postedAt: new Date(),
                                mediaURLs: payload.mediaURLs
                            }

                            // store current media uploads
                            if (experience.mediaUploads) {
                                mediaUploads = experience.mediaUploads
                            }

                            // only search for the right user if there are user that uploaded media
                            let myMediaUpload = null
                            if (mediaUploads.length > 0) {
                                // search for a media upload record of this user
                                myMediaUpload = mediaUploads.filter(mediaUpload => {
                                    return mediaUpload.user.uid === getters.user.uid
                                })[0]
                            }

                            // if the user has uploaded media to this experience before
                            if (myMediaUpload) {
                                let myMediaUploadIndex = mediaUploads.indexOf(myMediaUpload)
                                mediaUploads[myMediaUploadIndex] = mediaUploadData
                            } else {
                                // new media upload from this user
                                mediaUploads.push(mediaUploadData)
                            }

                            // update database
                            transaction.update(docRef, {
                                mediaUploads: mediaUploads
                            })
                        });
                }).then(function () {
                    resolve(mediaUploads)
                }).catch(function (error) {
                    console.log(error)
                    reject(error)
                })
            })
        },
    }
}