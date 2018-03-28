export default {
    user (state) {
        return state.user
    },
    userIsAuthenticated (state) {
        return state.user !== null && state.user !== undefined
    },
    explores (state) {
        return state.explores
    },
    experiences (state) {
        return state.experiences
    },
    loading (state) {
        return state.loading
    },
    message (state) {
        return state.message
    }
}