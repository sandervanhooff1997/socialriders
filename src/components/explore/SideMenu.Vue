<template>

</template>

<script>
    export default {
        name: 'side-menu',
        props: ['selectedExplore'],
        data () {
            return {
                mutableSelectedExplore this.selectedExplore
            }
        }
    }
</script>