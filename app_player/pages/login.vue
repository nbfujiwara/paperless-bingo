<template>
  <div class="myContainer">
    <div id="firebase-ui-container"></div>
    <div v-show="showCaption" class="px-2 text-left">
      <v-alert type="info"
        >社外の方も参加していただきたかったため、一人で複数参加できる仕様になりました。<br />あなたの良心を信じます</v-alert
      >
      <v-alert type="info"
        >「Sign in with
        Google」で会社アカウントを利用する場合、SSO制約にご注意ください</v-alert
      >
    </div>
    <!--
    <div class="pl-5 pr-5">
      <v-btn @click="login" class="primary" x-large block
        >Googleアカウントでログイン</v-btn
      >
      <div>
        会社アカウントを利用する場合、SSO制約でNGになっちゃう人がいるかも
      </div>
    </div>
    <v-divider class="mt-10 mb-10"></v-divider>
    <div class="pl-5 pr-5">
      <v-text-field
        v-model.trim="mail"
        :error-messages="mailErrorMessage"
        placeholder="メールアドレス"
        outlined
      ></v-text-field>
      <v-btn @click="sendMailForLogin" class="primary" x-large block
        >メアドでログイン</v-btn
      >
    </div>

    <div v-if="isAuthorizedSuccess">
      <nuxt-link to="/">こちらからどうぞ</nuxt-link>
    </div>
-->
  </div>
</template>

<script lang="ts">
import * as firebaseui from 'firebaseui'
import * as firebase from 'firebase/app'
import { Component, Vue } from 'vue-property-decorator'
import AppUtil from '../libs/AppUtil'
import { generalStateModule } from '~/store/modules/general'
import { basicStateModule } from '~/store/modules/basic'

@Component({
  layout: 'plane'
})
export default class LoginPage extends Vue {
  isAuthorizedSuccess = generalStateModule.isAuthorizedSuccess
  mail: string = ''
  mailErrorMessage: string = ''
  showCaption: boolean = false

  beforeMount() {
    // if (!generalStateModule.isAuthorized) {
    //  this.$router.push({ path: '/' })
    // }
  }
  mounted() {
    this.showCaption = false
    AppUtil.startAuthUI(
      '#firebase-ui-container',
      () => {
        if (generalStateModule.isRegistered) {
          this.$router.push({ path: '/main' })
        } else if (generalStateModule.isAuthorizedSuccess) {
          this.$router.push({ path: '/signup' })
        } else {
          generalStateModule.setToastMessage(
            '想定外。表示されてほしくないメッセージ'
          )
        }
      },
      () => {
        this.showCaption = true
      }
    )
  }
  login() {
    AppUtil.FBMng.loginRedirect()
  }
  sendMailForLogin() {
    if (!this.mail) {
      this.mailErrorMessage = '入力してください'
      return false
    }
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!pattern.test(this.mail)) {
      this.mailErrorMessage = 'メールアドレスの形式が間違っていそうです'
      return false
    }
    AppUtil.sendMailForAuth(this.mail)
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
