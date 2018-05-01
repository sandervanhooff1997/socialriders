<template>
    <router-link :to="{name: 'Profile', params: { uid: user.uid, profile: user }}">
        <v-chip class="scale" text-color="white" color="primary">
            <v-avatar>
                <img :src="user.photoUrl" alt="user.name">
            </v-avatar>
            <strong>{{user.name}}</strong>
        </v-chip>
    </router-link>
</template>

<script>
    export default {
        props: ['user']
    }
</script>