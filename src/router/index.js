import Vue from 'vue'
import Router from 'vue-router'

import ExperienceDetail from '@/components/experience/ExperienceDetail'
import ExperienceOverview from '@/components/experience/ExperienceOverview'
import Explore from '@/components/explore/Explore'
import Organize from '@/components/organize/Organize'
import Profile from '@/components/profile/Profile'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Explore
      },
      {
        path: '/explore',
        name: 'Explore',
        component: Explore
      },
      {
        path: '/experience',
        name: 'ExperienceOverview',
        component: ExperienceOverview
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile
      },
      {
        path: '/organize',
        name: 'Organize',
        component: Organize
      },
    ]
})
