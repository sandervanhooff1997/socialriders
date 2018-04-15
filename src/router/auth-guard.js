import { store } from '../vuex/vuex'

export default (to, from, next) => {
    if (store.getters.user) {
        next()
    } else {
        next('/signin')
    }
}