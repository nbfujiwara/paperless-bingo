<template>
  <div class="myContainer">
    <div>
      <v-btn @click="login()" class="primary" x-large block>Googleでログイン</v-btn>
      <div>@nijibox.co.jpのアカウントをお持ちで、本日SSO制約を通過できる場合はこちらが便利です</div>
    </div>
    <hr class="mt-10 mb-10" />
    <div>
      <v-btn class="primary" x-large block>メアドでログイン</v-btn>
      <div>Googleでログインができない場合はこちらから</div>
    </div>

    <div v-if="isAuthorizedSuccess">
      <nuxt-link to="/">こちらからどうぞ</nuxt-link>
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
