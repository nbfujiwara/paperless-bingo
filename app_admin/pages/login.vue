<template>
  <div class="myContainer">
    <div>
      <v-btn @click="login()" class="primary" x-large>ログイン</v-btn>
    </div>

    <div v-if="isAuthorizedSuccess && hasRole">
      <nuxt-link to="/">こちらからどうぞ</nuxt-link>
    </div>
    <div v-if="isAuthorizedSuccess && !hasRole">
      <v-alert class="warning ma-10">認証されたアカウントは権限を持ちません。コンソールから権限付与してください</v-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppUtil from '../libs/AppUtil'
import { generalStateModule } from '~/store/modules/general'

@Component({
  layout: 'plane'
})
export default class LoginPage extends Vue {
  isAuthorizedSuccess = generalStateModule.isAuthorizedSuccess
  hasRole = generalStateModule.hasRole

  beforeMount() {
    if (!generalStateModule.isAuthorized) {
      this.$router.push({ path: '/' })
    }
  }
  login() {
    AppUtil.FBMng.loginRedirect()
  }
}
</script>

<style scoped lang="scss">
.myContainer {
  margin: 0 auto;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
