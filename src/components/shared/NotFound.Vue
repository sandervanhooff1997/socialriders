<template>
    <div style="width: 100%;">
        <v-jumbotron>
            <v-container fill-height>
                <v-layout align-center>
                    <v-flex>
                        <h3 class="display-3">Oops.. 404</h3>
                        <span class="subheading">It seems like the page you are looking for does not exists...</span>
                        <v-divider class="my-3"></v-divider>
                        <v-btn large color="success" @click="goBack" class="mx-0">Go back</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-jumbotron>
    </div>
</template>

<script>
    export default {
        methods: {
            goBack () {
                window.history.length > 1
                    ? this.$router.go(-1)
                    : this.$router.push('/')
            }
        }
    }
</script>