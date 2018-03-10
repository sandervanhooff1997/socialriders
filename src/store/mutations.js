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
    setError (state, error) {
        state.error = error
    },
    clearError (state) {
        state.error = null
    }
}