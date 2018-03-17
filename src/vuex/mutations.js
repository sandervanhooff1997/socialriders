export default {
    setUser (state, user) {
        state.user = user
    },
    setExplores (state, explores) {
        state.explores = explores
    },
    setLoading (state, loading) {
        state.loading = loading
    },
    setMessage (state, message) {
        state.message = message
    },
    clearMessage (state) {
        state.message = null
    }
}