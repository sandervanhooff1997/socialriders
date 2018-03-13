import { store } from '../vuex/store'

export default (to, from, next) => {
    if (store.getters.user) {
        next()
    } else {
        next('/signin')
    }
}