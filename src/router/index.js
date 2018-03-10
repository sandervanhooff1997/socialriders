import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

import Experience from '@/components/experience/Experience'
import Experiences from '@/components/experience/Experiences'
import Explore from '@/components/explore/Explore'
import Organize from '@/components/organize/Organize'
import Profile from '@/components/profile/Profile'
import Signin from '@/components/signin/Signin'
import NotFound from '@/components/notfound/NotFound'

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
            path: '/experiences',
            name: 'Experiences',
            component: Experiences,
            beforeEnter: AuthGuard
        },
        {
            path: '/experience',
            name: 'Experience',
            component: Experience,
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
            component: Signin,
        },
        {
            path: '*',
            name: 'NotFound',
            component: NotFound
        }
    ]
})

export default router
