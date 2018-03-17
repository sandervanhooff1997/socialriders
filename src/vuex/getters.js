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
    loading (state) {
        return state.loading
    },
    message (state) {
        return state.message
    }
}