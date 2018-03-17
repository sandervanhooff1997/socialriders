import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

import Experience from '@/components/experience/Experience'
import Experiences from '@/components/experience/Experiences'
import Explore from '@/components/explore/Explore'
import Organize from '@/components/organize/Organize'
import Profile from '@/components/profile/Profile'
import Signin from '@/components/signin/Signin'
import NotFound from '@/components/shared/NotFound'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: {
                name: 'profile'
            }
        },
        {
            path: '/explore',
            name: 'explore',
            component: Explore,
            beforeEnter: AuthGuard
        },
        {
            path: '/experiences',
            name: 'experiences',
            component: Experiences,
            beforeEnter: AuthGuard
        },
        {
            path: '/experience',
            name: 'experience',
            component: Experience,
            beforeEnter: AuthGuard
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            beforeEnter: AuthGuard
        },
        {
            path: '/organize',
            name: 'organize',
            component: Organize,
            beforeEnter: AuthGuard
        },
        {
            path: '/signin',
            name: 'signin',
            component: Signin,
        },
        {
            path: '*',
            name: 'notfound',
            component: NotFound
        }
    ]
})

export default router
