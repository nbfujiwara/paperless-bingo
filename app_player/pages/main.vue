<template>
  <div class="myContainer">
    メイン画面

    <v-row v-for="(rowData, rowIdx) in sheetCells" :key="rowIdx">
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
          color="red"
          outlined
          @click="openHitCell(rowIdx, colIdx)"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IBingoCell } from '~/../common/interfaces/IBingoCell'
import { generalStateModule } from '~/store/modules/general'
import { basicStateModule } from '~/store/modules/basic'
import AppUtil from '~/libs/AppUtil'
import BingoLogic from '~/libs/BingoLogic'
import ABasePage from '~/libs/ABasePage'

@Component({})
export default class MainPage extends ABasePage {
  beforeMount() {
    console.log('before mount')
    this.commonBeforeMount()
  }
  sheet = basicStateModule.sheet

  get sheetCells(): IBingoCell[][] {
    return basicStateModule.sheetCells
  }
  mounted() {
    console.log('mounted2')
    BingoLogic.initializeLocalGameState()
    BingoLogic.generateSheetCells()
    BingoLogic.watchGameChanges()
  }

  private openHitCell(row: number, col: number){
    BingoLogic.openHitCell(row, col)
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
