import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

import ExperienceDetail from '@/components/experience/ExperienceDetail'
import ExperienceOverview from '@/components/experience/ExperienceOverview'
import Explore from '@/components/explore/Explore'
import Organize from '@/components/organize/Organize'
import Profile from '@/components/profile/Profile'
import Signin from '@/components/signin/Signin'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Explore,
            beforeEnter: AuthGuard
        },
        {
            path: '/explore',
            name: 'Explore',
            component: Explore,
            beforeEnter: AuthGuard
        },
        {
            path: '/experience',
            name: 'ExperienceOverview',
            component: ExperienceOverview,
            beforeEnter: AuthGuard
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
            beforeEnter: AuthGuard
        },
        {
            path: '/organize',
            name: 'Organize',
            component: Organize,
            beforeEnter: AuthGuard
        },
        {
            path: '/signin',
            name: 'Signin',
            component: Signin
        },
    ]
})

export default router
