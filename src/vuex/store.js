import Vue from 'vue'
import Vuex from 'Vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

/**
 * Vuex Store tutorial
 *
 * Payload:
 * The payload often gets passed as a second argument to the mutation/action.
 * You can define 1 object by executing commit('mutation/action name', payload)
 * Or you can define multiple objects by executing commit({
 *  type: 'mutation/action name',
 *  object1: {},
 *  object2: {}
 * })
 */

export const store = new Vuex.Store({
    /**
     * state manages a central state of your application. No direct changes to the state should be made, only via mutations.
     */
    state,

    /**
     * getters return the state to the component asking. You should always get the state via getters.
     */
    getters,

    /**
     * mutations mutate the state in a fashionable way (the safe way). State changes should always happen via mutations.
     * mutations ALWAYS mutate the state in a synchronous manor, if asynchronous operations are required, use actions instead.
     */
    mutations,

    /**
     * actions are methods centralized in the vuex, and can be executed from every component.
     * actions can run asynchronously in comparison to mutations
     */
    actions,

})