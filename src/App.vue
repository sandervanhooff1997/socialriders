<template>
  <v-app>
      <!--Mobile Menu-->
      <v-navigation-drawer  app v-model="drawer">
        <v-list class="pt-0">

            <!--Menu links-->
              <v-list-tile v-for="item in menuItems" :to="item.link" :key="item.text">
                <v-list-tile-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <!--Desktop menu-->
      <v-toolbar class="primary" dark app>
        <v-toolbar-side-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
        <v-toolbar-title>
          <span class="hidden-sm-and-down">{{ title }}</span>
        </v-toolbar-title>
        <v-text-field
                flat
                solo-inverted
                prepend-icon="explore"
                v-if="['explore'].indexOf($route.name) > -1"
                id="search-input"
                class="mx-3"
        ></v-text-field>
        <v-spacer v-if="['explore'].indexOf($route.name) < 0"></v-spacer>

        <!--Menu Links-->
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn v-for="menuItem in menuItems" flat :to="menuItem.link">
              <v-icon left dark>{{menuItem.icon}}</v-icon>
              {{menuItem.text}}
          </v-btn>
        </v-toolbar-items>
        <v-btn icon v-if="userIsAuthenticated">
            <!--Profile Icon Menu-->
            <v-menu transition="slide-y-transition" bottom>
                <v-avatar size="36px" slot="activator">
                    <img :src="user.photoUrl" alt="user.name">
                </v-avatar>
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img :src="user.photoUrl" :alt="user.name">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{user.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="onLogout">
                        <v-list-tile-content>
                            <v-list-tile-title class="text-xs-center">Logout</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-btn>
      </v-toolbar>

      <v-content id="appContent">
          <router-view></router-view>
      </v-content>

  </v-app>
</template>

<script>
    import * as firebase from 'firebase'

    export default {
        name: 'App',
        data: () => ({
            dialog: false,
            drawer: false,
            title: 'SocialRiders',
            profileMenu: false
        }),
        methods: {
            onLogout () {
                this.$store.dispatch('logout')
                this.$router.push('/signin')
            }
        },
        computed: {
            menuItems () {
                let menuItems = [
                    {icon: 'lock_open', text: 'Sign in', link: '/signin'}
                ]

                if (this.userIsAuthenticated) {
                    menuItems = [
                        {icon: 'explore', text: 'Explore', link: '/explore'},
                        {icon: 'language', text: 'Experience', link: '/experience'},
                        {icon: 'alarm_on', text: 'Organize', link: '/organize'},
                        {icon: 'face', text: 'Profile', link: '/profile'}
                    ]
                }

                return menuItems
            },
            userIsAuthenticated () {
                return this.$store.getters.userIsAuthenticated
            },
            user () {
                return this.$store.getters.user
            }
        }
    }
</script>

<style>
    #appContent > div > div {
        height: 100%;
    }
</style>