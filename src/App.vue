<template>
  <v-app>
      <v-navigation-drawer
              fixed
              :clipped="$vuetify.breakpoint.mdAndUp"
              app
              v-model="drawer"
      >
        <v-list class="pt-0" dense>
          <v-list-tile v-for="item in items" :to="item.link" :key="item.text" @click="">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
          <v-divider></v-divider>
          <!--<signin></signin>-->
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
        <v-btn icon>
          <v-icon>apps</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>notifications</v-icon>
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
    import Signin from './components/signin/Signin'

    export default {
        name: 'App',
        components: {
            Signin
        },
        data: () => ({
            dialog: false,
            drawer: null,
            title: 'SocialRiders',
            items: [
                { icon: 'explore', text: 'Explore', link: '/explore' },
                { icon: 'language', text: 'Experience', link: '/experience' },
                { icon: 'alarm_on', text: 'Organize', link: '/organize' },
                { icon: 'face', text: 'Profile', link: '/profile' },
            ],
        }),
        props: {
            source: String
        },
        mounted () {

        }
    }
</script>