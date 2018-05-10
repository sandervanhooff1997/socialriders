<template>
    <v-snackbar
            :timeout="timeout"
            bottom
            right
            value="true"
            :color="className"
            fixed
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
        computed: {
            className () {
                if (this.type === 'success') {
                    return 'primary'
                }
                return 'error'
            }
        },
        props: ['text', 'type'],
        created () {
            let self = this;
            setTimeout(function() {
                self.onClose()
            }, this.timeout)
        }
    }
</script>