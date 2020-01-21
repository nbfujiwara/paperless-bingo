<template>
  <div class="containerWithHeader">
    <page-header title-text="HOME"></page-header>
    <div class="main">
      <v-btn @click="resetGame" class="primary">ゲームリセット</v-btn>
      <v-btn @click="closeGameEntry" class="primary">エントリー締め切り</v-btn>
      <v-btn class="primary" to="/manual-add">手動追加</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppUtil from '~/libs/AppUtil'
import UtilDate from '~/../common/libs/UtilDate'
import ABasePage from '~/libs/ABasePage'
import BingoLogic from '~/libs/BingoLogic'

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
  closeGameEntry() {
    BingoLogic.startGame()
  }
}
</script>

<style scoped lang="scss"></style>
