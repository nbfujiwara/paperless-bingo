<template>
  <div class="containerWithHeader">
    <page-header title-text="HOME"></page-header>
    <div class="main">
      <v-btn
        :disabled="currentGame.started"
        @click="closeGameEntry"
        class="primary"
        >エントリー締め切り</v-btn
      >
      <v-btn :disabled="!currentGame.started" class="primary" to="/roulette"
        >【投影用】抽選画面</v-btn
      >
      <v-btn class="primary" to="/entries"
        >エントリー一覧</v-btn
      >

      <v-divider class="my-5"></v-divider>
      <v-card class="mx-10">
        <v-card-title>Game状態</v-card-title>

        <v-row>
          <v-col cols="2" class="text-right">
            <v-label>ステータス</v-label>
          </v-col>
          <v-col cols="10" class="text-left">
            <span v-if="currentGame.started">開始済み</span>
            <span v-else>エントリー受付中</span>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-label>抽選番号</v-label>
          </v-col>
          <v-col cols="10" class="text-left">
            <v-chip v-for="num in currentGame.hits" :key="num" outlined>{{
              num
            }}</v-chip>
          </v-col>
        </v-row>
      </v-card>

      <v-divider class="my-5"></v-divider>
      <nuxt-link to="/danger">危険な機能や開発専用機能</nuxt-link>

    </div>
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
  mounted() {
    AppUtil.loadGame()
  }
  get currentGame() {
    return bingoStateModule.game
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
