<template>

    <div style="width: 100%;">

        <v-bottom-sheet v-model="sheet">
            <!--<v-btn slot="activator" color="purple" dark>Click me</v-btn>-->

            <v-list  slot="activator" class="pt-0 signinButton" dense >
                <v-list-tile >
                    <v-list-tile-action>
                        <v-icon>lock_open</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Sign in</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>


            <v-list>
                <v-subheader>Sign in with</v-subheader>
                <v-list-tile
                        v-for="tile in tiles"
                        :key="tile.title"
                        @click="sheet = false"
                >
                    <v-list-tile-action>
                            <facebook-signin id="fbLoginBtn" v-if="tile.provider == 'facebook'"></facebook-signin>
                            <google-signin v-if="tile.provider == 'google'"></google-signin>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-bottom-sheet>
    </div>
</template>

<script>
    import FacebookSignin from './FacebookSignin'
    import GoogleSignin from './GoogleSignin'

    export default {
        name: 'signin',
        components: {
            FacebookSignin,
            GoogleSignin
        },
        data () {
            return {
                sheet: false,
                tiles: [
                    { title: 'Continue with Facebook', provider: 'facebook' },
//                    { title: 'Continue with Google', provider: 'google' },
                ]
            }
        },
        mounted () {
//            console.log(this.$session.getAll())
//            console.log(this.$logged)
        }
    }
</script>

<style scoped>
    .signinButton {
        cursor: pointer;
    }
</style>