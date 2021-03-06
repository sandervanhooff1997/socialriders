<template>
  <v-app dark>
      <div class="application-overlay white-overlay" :class="{'on-signin-page': onSignInPage}">
          <!--Show app messages-->
          <app-message v-if="message" @dismissed="onDismissed" :text="message.text" :type="message.type"></app-message>

          <!--Mobile Menu-->
          <v-navigation-drawer
                  v-if="$route.name !== 'signin'"
                  app
                  disable-resize-watcher
                  class="background"
                  v-model="drawer">
              <div class="sidebar-overlay">
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
              </div>
          </v-navigation-drawer>

          <!--Desktop menu-->
          <v-toolbar v-if="$route.name !== 'Signin'" class="toolbar colored-overlay" absolute>
            <v-toolbar-side-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
            <img width="40px" src="@/assets/images/logo-white64x64.png" class="ml-3 hidden-sm-and-down">

            <v-toolbar-title v-if="!drawer">
                <span class="hidden-sm-and-down white--text">{{ title }}</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!--Menu Links-->
            <v-toolbar-items class="hidden-sm-and-down">
              <v-btn v-for="menuItem in menuItems" :key="menuItem.text" flat :to="menuItem.link">
                  <v-icon left dark>{{menuItem.icon}}</v-icon>
                  {{menuItem.text}}
              </v-btn>
            </v-toolbar-items>
            <v-btn icon v-if="userIsAuthenticated">
                <!--Profile Icon Menu-->
                <v-menu transition="slide-y-transition" bottom>
                        <v-avatar size="36px" slot="activator">
                            <img :src="user.photoUrl" :alt="user.name">
                        </v-avatar>
                        <v-list subheader style="padding-bottom: 0;" class="background-small">
                            <div class="colored-overlay">
                                <v-list-tile avatar>
                                    <v-list-tile-avatar>
                                        <img :src="user.photoUrl" :alt="user.name">
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{user.name}}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile :to="{name:'Profile', params: { uid: user.uid, profile: user }}">
                                    <v-list-tile-content>
                                        <v-list-tile-title class="text-xs-center">My Profile</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile @click="onLogout">
                                    <v-list-tile-content>
                                        <v-list-tile-title class="text-xs-center">Logout</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </div>
                        </v-list>
                </v-menu>
            </v-btn>
          </v-toolbar>

          <v-content class="appContent">
              <router-view :key="$route.fullPath"></router-view>
          </v-content>
      </div>
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
            profileMenu: false,
            menuItems: [
                {icon: 'explore', text: 'Explore', link: '/explore'},
                {icon: 'language', text: 'Experience', link: '/experience'},
                {icon: 'alarm_on', text: 'Organize', link: '/organize'},
            ]
        }),
        methods: {
            onLogout () {
                this.$store.dispatch('logout')
                this.$router.push('/signin')
            },
            onDismissed () {
                this.$store.dispatch('clearMessage')
            }
        },
        computed: {
            userIsAuthenticated () {
                return this.$store.getters.userIsAuthenticated
            },
            user () {
                return this.$store.getters.user
            },
            message () {
                return this.$store.getters.message
            },
            onSignInPage () {
                return this.$route.name === 'Signin'
            },
        }
    }
</script>