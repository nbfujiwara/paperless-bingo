<template>
  <div class="myContainer">
    メイン画面

    <v-row v-for="(rowData, rowIdx) in sheet2D" :key="rowIdx">
      <v-col
        v-for="(num, colIdx) in rowData"
        :key="`${rowIdx}_${colIdx}`"
        cols="2"
        >{{ num }}</v-col
      >
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { generalStateModule } from '~/store/modules/general'
import { basicStateModule } from '~/store/modules/basic'
import AppUtil from '~/libs/AppUtil'
import BingoLogic from '~/libs/BingoLogic'

@Component({})
export default class MainPage extends Vue {
  sheet = basicStateModule.sheet
  sheet2D: number[][] = []
  mounted() {
    if (!generalStateModule.isRegistered) {
      this.$router.push({ path: '/' })
    }
    this.sheet2D = BingoLogic.convertSheet2D(this.sheet)
    BingoLogic.watchGameChanges()
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
