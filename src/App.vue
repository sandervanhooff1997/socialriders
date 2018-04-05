<template>
  <v-app :class="{onSignInPage : onSignInPage}">
      <!--Show app messages-->
      <app-alert v-if="message" @dismissed="onDismissed" :text="message.text" :type="message.type"></app-alert>

      <!--Mobile Menu-->
      <v-navigation-drawer v-if="$route.name !== 'signin'" app v-model="drawer">
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
      <v-toolbar v-if="$route.name !== 'signin'" class="toolbar purple-to-orange" dark app>
        <v-toolbar-side-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>

        <v-toolbar-title>
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
                    <v-list-tile to="/profile">
                        <v-list-tile-content>
                            <v-list-tile-title class="text-xs-center">Profile</v-list-tile-title>
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
                return this.$route.name === 'signin'
            },
        }
    }
</script>

<style>

</style>