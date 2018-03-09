<template>
  <div>
    <div id="google-signin-btn" class="g-signin2"></div>
  </div>
</template>

<script>

export default {
    name: 'google-signin',
    methods: {
        onSignIn: function (googleUser) {
          var profile = googleUser.getBasicProfile();

          var user = {
              provider: 'google',
              personalID: profile.getId(),
              email: profile.getEmail(),
              name: profile.getName(),
              pictureUrl: profile.getImageUrl()
          }

          this.$session.start()
          this.$session.set('googleProfile', user)
      }
    }
}
</script>
