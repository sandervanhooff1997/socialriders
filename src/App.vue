<template>
  <v-app>

      <v-navigation-drawer
              fixed
              :clipped="$vuetify.breakpoint.mdAndUp"
              app
              v-model="drawer"
      >
        <v-list class="pt-0" dense>
            <!--Website links-->
              <v-list-tile v-for="item in menuItems" :to="item.link" :key="item.text">
                <v-list-tile-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            <v-divider></v-divider>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar
              color="blue darken-3"
              dark
              app
              :clipped-left="$vuetify.breakpoint.mdAndUp"
              fixed
      >
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          <span class="hidden-sm-and-down">{{ title }}</span>
        </v-toolbar-title>
        <v-text-field
                flat
                solo-inverted
                prepend-icon="search"
                label="Explore"
                class="hidden-sm-and-down"
                v-if="['Explore'].indexOf($route.name) > -1"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn icon v-if="userIsAuthenticated">
            <v-menu
                    transition="slide-y-transition"
                    bottom
            >
                <v-avatar size="36px" slot="activator">
                    <img :src="user.photoUrl" alt="user.name">
                </v-avatar>
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img :src="user.photoUrl" alt="user.name">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{user.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="onLogout">
                        <v-list-tile-content>
                            <v-list-tile-title>Logout</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <!--<v-menu-->
                    <!--offset-x-->
                    <!--:close-on-content-click="false"-->
                    <!--:nudge-width="200"-->
                    <!--v-model="profileMenu"-->
            <!--&gt;-->
                <!--<v-card>-->
                    <!--<v-list>-->
                        <!--<v-list-tile avatar>-->
                            <!--<v-list-tile-avatar>-->
                                <!--<img src="https://vuetifyjs.com/static/doc-images/john.jpg" alt="John">-->
                            <!--</v-list-tile-avatar>-->
                            <!--<v-list-tile-content>-->
                                <!--<v-list-tile-title>Sander van Hooff</v-list-tile-title>-->
                                <!--<v-list-tile-sub-title>s.vanhooff@hotmail.com</v-list-tile-sub-title>-->
                            <!--</v-list-tile-content>-->
                        <!--</v-list-tile>-->
                    <!--</v-list>-->
                    <!--<v-card-actions>-->
                        <!--<v-spacer></v-spacer>-->
                        <!--<v-btn flat @click="profileMenu = false">Cancel</v-btn>-->
                    <!--</v-card-actions>-->
                <!--</v-card>-->
            <!--</v-menu>-->

        </v-btn>
      </v-toolbar>

      <v-content>
          <v-layout style="height: 100%;">
            <router-view></router-view>
          </v-layout>
      </v-content>

  </v-app>
</template>

<script>
    import * as firebase from 'firebase'

    export default {
        name: 'App',
        data: () => ({
            dialog: false,
            drawer: null,
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