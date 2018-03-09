<template>
  <div>
    <facebook-login class="button"
                    appId="352135441945747"
                    version="v2.12"
                    loginLabel="Continue with Facebook"
                    @login="onLogin"
                    @logout="onLogout"
                    @sdk-loaded="sdkLoaded"
                    v-show="logged">
    </facebook-login>
  </div>
</template>

<script>
    import facebookLogin from 'facebook-login-vuejs';

  export default {
      name: 'facebook-signin',
      components: {
          facebookLogin
      },
      data () {
          return {
              FB: undefined
          }
      },
      methods: {
          getUserData: function(){
              this.FB.api('/me', 'GET', { fields: 'id,name,email,picture' },
                  userInformation => {
                      var user = {
                          provider: 'facebook',
                          personalID: userInformation.id,
                          email: userInformation.email,
                          name: userInformation.name,
                          pictureUrl: userInformation.picture.data.url
                      }

                      this.$session.start()
                      this.$session.set('facebookProfile', user)

                  }
              )

          },
          sdkLoaded(payload) {
              this.isConnected = payload.isConnected
              this.FB = payload.FB
              if (this.isConnected) this.getUserData()
          },
          onLogin() {
              this.isConnected = true
              this.getUserData()
          },
          onLogout() {
              this.isConnected = false;
          },
          setElements(isLoggedIn){
            if (isLoggedIn) {

            } else {

            }
          }
      },
      mounted () {
          if (this.$session.has('facebookProfile')) {

          }
      }
    }
</script>
