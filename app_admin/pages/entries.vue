<template>
  <div class="containerWithHeader">
    <page-header title-text="エントリー一覧"></page-header>
    <div class="main">
      <v-row justify="center" align="center">
        <v-col>
          <v-btn @click="loadEntries" class="primary">リロード(Entry)</v-btn>
          <v-btn @click="loadGame" class="primary">リロード(Game)</v-btn>
        </v-col>
        <v-col>
          <v-row no-gutters>
            <v-col cols="12"
              ><v-card outlined tile
                ><div>Total</div>
                <div>{{ totalCount }}</div></v-card
              ></v-col
            >
          </v-row>
          <v-row no-gutters>
            <v-col cols="4"
              ><v-card outlined tile
                ><div>通常</div>
                <div>{{ normalCount }}</div></v-card
              ></v-col
            >
            <v-col cols="4"
              ><v-card outlined tile
                ><div>リーチ</div>
                <div>{{ reachCount }}</div></v-card
              ></v-col
            >
            <v-col cols="4"
              ><v-card outlined tile
                ><div>ビンゴ</div>
                <div>{{ bingoCount }}</div></v-card
              ></v-col
            >
          </v-row>
          <v-row no-gutters>
            <v-col cols="12"
              ><v-card outlined tile
                ><div>Hits</div>
                <div>{{ hits }}</div></v-card
              ></v-col
            >
          </v-row>
        </v-col>
      </v-row>
      <v-data-table
        :headers="tableHeaders"
        :items="tableItems"
        class="text-left"
        dense
      ></v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import MasterDao from '~/../common/libs/MasterDao'
import AppUtil from '~/libs/AppUtil'
import ABasePage from '~/libs/ABasePage'
import BingoLogic from '~/libs/BingoLogic'
import { basicStateModule } from '~/store/modules/basic'

@Component({
  components: {
    PageHeader: () => import('~/components/PageHeader.vue')
  }
})
export default class EntriesPage extends ABasePage {
  private totalCount: number = 0
  private normalCount: number = 0
  private reachCount: number = 0
  private bingoCount: number = 0

  beforeMount() {
    this.commonBeforeMount()
  }

  mounted() {
    this.loadEntries()
  }
  private tableHeaders: { [s: string]: any }[] = [
    {
      text: '氏名',
      value: 'name',
      sortable: false
    },
    {
      text: 'メール',
      value: 'mail',
      align: 'start'
    },
    {
      text: '所属',
      value: 'department'
    },
    {
      text: 'シート',
      value: 'sheet',
      sortable: false
    },
    {
      text: '状態',
      value: 'status'
    }
  ]
  private tableItems: { [s: string]: any }[] = []

  get hits(): number[] {
    return basicStateModule.game.hits
  }

  @Watch('hits')
  onChangeHitList(newVal: number[], oldVal: number[]) {
    this.refreshTableItems()
  }

  private refreshTableItems() {
    this.totalCount = 0
    this.normalCount = 0
    this.reachCount = 0
    this.bingoCount = 0
    this.tableItems.splice(0, this.tableItems.length)
    for (const entry of basicStateModule.entries) {
      const department = MasterDao.department(entry.user.departmentId)
      let departmentName = ''
      if (department) {
        departmentName = department.name
        if (department.withText && entry.user.departmentEtcText) {
          departmentName += '(' + entry.user.departmentEtcText + ')'
        }
      }
      const sheetStatus = BingoLogic.getSheetStatus(entry.sheet, this.hits)

      this.totalCount++
      if (sheetStatus === BingoLogic.SHEET_STATUS_NORMAL) {
        this.normalCount++
      } else if (sheetStatus === BingoLogic.SHEET_STATUS_REACH) {
        this.reachCount++
      } else if (sheetStatus === BingoLogic.SHEET_STATUS_BINGO) {
        this.bingoCount++
      }
      this.tableItems.push({
        name: entry.user.name,
        mail: entry.user.mail,
        department: departmentName,
        sheet: entry.sheet,
        status: sheetStatus + ':' + BingoLogic.getSheetStatusName(sheetStatus)
      })
    }
  }

  loadGame() {
    BingoLogic.loadGame()
  }
  loadEntries() {
    BingoLogic.loadEntries().then(() => {
      this.refreshTableItems()
    })
  }
}
</script>

<style scoped lang="scss"></style>
