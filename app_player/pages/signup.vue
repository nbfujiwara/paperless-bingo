<template>
  <div class="myContainer">
    <v-card class="ma-2 ">
      <v-card-title>参加フォーム</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="mail"
          label="メールアドレス"
          readonly
          disabled
        ></v-text-field>
        <v-text-field
          v-model="name"
          label="氏名"
          placeholder="本名でお願いします"
        ></v-text-field>
        <v-text-field
          v-model="department"
          label="所属"
          placeholder="事業部・室でかまいません"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="executeRegister()" class="primary" x-large>登録</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { generalStateModule } from '~/store/modules/general'
import { basicStateModule } from '~/store/modules/basic'
import AppUtil from '~/libs/AppUtil'
import BingoLogic from '~/libs/BingoLogic'

@Component({})
export default class SignupPage extends Vue {
  name = basicStateModule.user.name
  mail = basicStateModule.user.mail
  department = basicStateModule.user.department

  mounted() {
    if (!generalStateModule.isAuthorized) {
      this.$router.push({ path: '/' })
    }
  }
  executeRegister() {
    const user = {
      name: this.name,
      mail: this.mail,
      department: this.department
    }
    BingoLogic.entry(user).then(() => {
      this.$router.push({ path: '/main' })
    })
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
