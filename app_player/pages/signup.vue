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
          :error-messages="errorMessageName"
          label="氏名"
          placeholder="本名でお願いします"
        ></v-text-field>

        <v-radio-group
          v-model="departmentId"
          @change="onChangeDepartment"
          :error-messages="errorMessageDepartment"
          label="所属"
        >
          <v-radio
            v-for="(dep, idx) in departmentList"
            :label="dep.name"
            :value="dep.id"
            :key="idx"
          ></v-radio>
        </v-radio-group>
        <v-text-field
          v-model="departmentEtcText"
          v-show="showEtcTextInput"
          :error-messages="errorMessageDepartmentEtc"
          placeholder="会社名など。分かればなんでもいいです"
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
import { IUser } from '../../common/interfaces/IUser'
import { generalStateModule } from '~/store/modules/general'
import { basicStateModule } from '~/store/modules/basic'
import AppUtil from '~/libs/AppUtil'
import BingoLogic from '~/libs/BingoLogic'
import MasterDao from '~/../common/libs/MasterDao'

@Component({})
export default class SignupPage extends Vue {
  name = basicStateModule.user.name
  mail = basicStateModule.user.mail

  departmentEtcText: string = ''
  departmentList = MasterDao.departmentList()
  departmentId: number = 0
  showEtcTextInput: boolean = false

  errorMessageName: string = ''
  errorMessageDepartment: string = ''
  errorMessageDepartmentEtc: string = ''

  mounted() {
    if (!generalStateModule.isAuthorized) {
      this.$router.push({ path: '/' })
    }
  }

  onChangeDepartment() {
    const dep = MasterDao.department(this.departmentId)
    if (dep && dep.withText) {
      this.showEtcTextInput = true
    } else {
      this.showEtcTextInput = false
    }
  }

  validateRegister() {
    this.errorMessageName = ''
    this.errorMessageDepartment = ''
    this.errorMessageDepartmentEtc = ''
    let warning = false
    if (!this.name) {
      this.errorMessageName = '入力してください'
      warning = true
    }
    if (!this.departmentId) {
      this.errorMessageDepartment = '選択してください'
      warning = true
    }
    const dep = MasterDao.department(this.departmentId)
    if (dep && dep.withText) {
      if (!this.departmentEtcText) {
        this.errorMessageDepartmentEtc = '入力してください'
        warning = true
      }
    }

    return warning
  }
  executeRegister() {
    const user: IUser = {
      name: this.name,
      mail: this.mail,
      departmentId: this.departmentId
    }
    const dep = MasterDao.department(this.departmentId)
    if (dep && dep.withText) {
      user.departmentEtcText = this.departmentEtcText
    }

    const warning = this.validateRegister()
    if (!warning) {
      BingoLogic.entry(user).then(() => {
        this.$router.push({ path: '/main' })
      })
    }
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
