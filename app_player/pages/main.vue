<template>
  <div class="myContainer">
    メイン画面

    <v-row v-for="(rowData, rowIdx) in sheetCells" :key="rowIdx">
      <v-col cols="1"></v-col>
      <v-col
        v-for="(cell, colIdx) in rowData"
        :key="`${rowIdx}_${colIdx}`"
        cols="2"
      >
        <v-chip v-show="cell.center" color="teal" text-color="white">
          <v-icon>mdi-star</v-icon>
        </v-chip>
        <v-chip
          v-show="!cell.center && cell.opened"
          color="teal"
          text-color="white"
        >
          {{ cell.num }}
        </v-chip>
        <v-chip
          v-show="!cell.center && !cell.opened && cell.hit"
          @click="openHitCell(rowIdx, colIdx)"
          color="red"
          outlined
        >
          {{ cell.num }}
        </v-chip>
        <v-chip
          v-show="!cell.center && !cell.opened && !cell.hit"
          color="primary"
          outlined
        >
          {{ cell.num }}
        </v-chip>
      </v-col>
    </v-row>
    <template v-if="!gameStarted">
      <v-divider class="my-5"></v-divider>
      <v-btn @click="resetSheet" class="primary"
        >BINGOシートを変えたい場合はこちら</v-btn
      >
      <p>※開始時間が近くなると変更できなくなります</p>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IBingoCell } from '~/../common/interfaces/IBingoCell'
import { basicStateModule } from '~/store/modules/basic'
import GameUtil from '~/libs/GameUtil'
import ABasePage from '~/libs/ABasePage'

@Component({})
export default class MainPage extends ABasePage {
  beforeMount() {
    this.commonBeforeMount()
  }
  get sheet() {
    return basicStateModule.sheet
  }
  get sheetCells(): IBingoCell[][] {
    return basicStateModule.sheetCells
  }
  get gameStarted(): boolean {
    return basicStateModule.game.started
  }
  mounted() {
    GameUtil.initializeLocalGameState()
    GameUtil.watchGameChanges()
  }
  private resetSheet() {
    GameUtil.resetSheet()
  }

  private openHitCell(row: number, col: number) {
    GameUtil.openHitCell(row, col)
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
