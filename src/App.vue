<template>
  <v-app>
      <v-navigation-drawer temporary v-model="sideNav">
        <v-list>
          <v-list-tile
                  v-for="item in menuItems"
                  :key="item.title"
                  router
                  :to="item.link">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>{{ item.title }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar fixed dark class="primary">
        <v-toolbar-side-icon
                @click.stop.native="sideNav = !sideNav"
                class="hidden-sm-and-up"></v-toolbar-side-icon>
        <v-toolbar-title>
          <v-router-link to="/" tag="span" style="cursor: pointer;">{{ title }}</v-router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn
                  flat
                  v-for="item in menuItems"
                  :key="item.title"
                  router
                  :to="item.link">
            <v-icon left dark>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

  </v-app>
</template>

<script>
export default {
  name: 'App',
    data() {
        return {
            sideNav: false,
            title: 'SocialRider',
            menuItems: [
                { icon: 'face', title: 'Sign up', link: '/signup' },
                { icon: 'lock_open', title: 'Sign in', link: '/signin' }
            ]
        }
    }
}
</script>
