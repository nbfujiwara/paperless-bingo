<template>
  <div class="myContainer">
    <div id="firebase-ui-container"></div>
    <div v-show="showCaption" class="px-2 text-left">
      <v-alert type="info"
        >「Sign in with Google」について
        <br />会社アカウントを利用する場合、SSOにご注意ください</v-alert
      >
      <v-alert type="info"
        >「Sign in with email」について
        <br />入力したメアドにアクセスURLが記載されたものが届きますが、今のブラウザでURLを開かないとうまくいきません
        <br />URLをコピペなどしないとダメでちょっと使いづらいです</v-alert
      >
      <v-alert type="info"
        >「Continue as guest」について <br />上記2つが使えない場合用です
        <br />すぐ利用できますが、画面を閉じたりすると復帰できないかもしれないリスクがあります
      </v-alert>
      <v-alert type="info"
        >一人で複数参加できる仕様です。<br />あなたの良心を信じます</v-alert
      >
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
  showCaption: boolean = false

  beforeMount() {}
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
