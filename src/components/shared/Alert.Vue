<template>
    <!--<v-alert type="error" dismissible @input="onClose" :value="true" transition="scale-transition">-->
        <!--{{ text }}-->
    <!--</v-alert>-->
    <v-snackbar
            :timeout="timeout"
            :bottom="true"
            :right="true"
            :value="true"
            :color="'info'"
            :multi-line="true"
    >
        {{ text }}
        <v-btn flat color="white" @click="onClose">Close</v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        data () {
            return {
                timeout: 6000
            }
        },
        methods: {
            onClose () {
                this.$emit('dismissed')
            }
        },
        props: ['text'],
        created () {
            let self = this;
            setTimeout(function() {
                self.onClose()
            }, this.timeout)
        }
    }
</script>