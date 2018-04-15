import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

import Experience from '@/components/experience/Experience'
import Experiences from '@/components/experience/Experiences'
import Explores from '@/components/explore/Explores'
import Organize from '@/components/organize/Organize'
import Profile from '@/components/profile/Profile'
import Signin from '@/components/signin/Signin'
import NotFound from '@/components/shared/NotFound'
import MapBox from '@/components/mapbox/MapBox'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: {
                name: 'Explores',
                params: {
                    id: '8sZ9I854qffhSbsHzsBg'
                }
            }
        },
        {
            path: '/mapbox',
            name: 'MapBox',
            component: MapBox,
            beforeEnter: AuthGuard
        },
        {
            path: '/explore',
            name: 'Explores',
            component: Explores,
            beforeEnter: AuthGuard
        },
        {
            path: '/experience',
            name: 'Experiences',
            component: Experiences,
            beforeEnter: AuthGuard,
        },
        {
            path: '/experience/:id',
            name: 'Experience',
            component: Experience,
            beforeEnter: AuthGuard
        },
        {
            path: '/profile/:uid',
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
