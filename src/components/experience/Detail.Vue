<template>
    <div>
        <v-jumbotron v-if="experience" dark class="banner">
            <v-container fill-height>
                <v-layout align-center>
                    <v-flex text-xs-center>
                        <h3 class="display-3 thinText">{{experience.title}}</h3>
                        <span class="subheading thinText">Share your experiences with other drivers</span>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-jumbotron>


    </div>
</template>

<script>
    export default {
        props: ['id'],
        data () {
            return {
                experience: null
            }
        },
        mounted () {
            this.$store.dispatch('getExperience', this.id).then(response => {
                this.experience = response
            }, error => {
                console.log(error)
                this.$store.dispatch('errorMessage', error.message)
            })
        },
    }
</script>

<style scoped>
    .banner {
        height: 200px!important;
    }
</style>