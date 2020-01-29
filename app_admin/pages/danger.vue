<template>
  <div class="containerWithHeader">
    <page-header title-text="HOME"></page-header>
    <div class="main">

      <v-btn @click="resetGame" class="primary">ゲームリセット</v-btn>
      <v-btn class="primary" to="/manual-add">手動追加</v-btn>
    </div>
    <v-divider class="my-5"></v-divider>
    <nuxt-link to="/home">戻る</nuxt-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppUtil from '~/libs/AppUtil'
import UtilDate from '~/../common/libs/UtilDate'
import ABasePage from '~/libs/ABasePage'
import BingoLogic from '~/libs/BingoLogic'
import { basicStateModule } from '~/store/modules/basic'
import { bingoStateModule } from '~/store/modules/bingo'

@Component({
  components: {
    PageHeader: () => import('~/components/PageHeader.vue')
  }
})
export default class HomePage extends ABasePage {
  beforeMount() {
    this.commonBeforeMount()
  }
  resetGame() {
    BingoLogic.resetGame()
  }
}
</script>

<style scoped lang="scss"></style>
