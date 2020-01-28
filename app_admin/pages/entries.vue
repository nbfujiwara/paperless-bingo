<template>
  <div class="containerWithHeader">
    <page-header title-text="エントリー一覧"></page-header>
    <div class="main">
      <v-btn @click="loadEntries" class="primary">データリロード</v-btn>
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
import { Component, Vue, Watch } from 'vue-property-decorator'
import MasterDao from '../../common/libs/MasterDao'
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
export default class EntriesPage extends ABasePage {
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
    return bingoStateModule.game.hits
  }

  private refreshTableItems() {
    console.log('called refreshTableItems3')
    this.tableItems.splice(0, this.tableItems.length)
    for (const entry of bingoStateModule.entries) {
      const department = MasterDao.department(entry.user.departmentId)
      let departmentName = ''
      if (department) {
        departmentName = department.name
        if (department.withText && entry.user.departmentEtcText) {
          departmentName += '(' + entry.user.departmentEtcText + ')'
        }
      }
      const sheetStatus = BingoLogic.getSheetStatus(entry.sheet, this.hits)
      this.tableItems.push({
        name: entry.user.name,
        mail: entry.user.mail,
        department: departmentName,
        sheet: entry.sheet,
        status: sheetStatus + ':' + BingoLogic.getSheetStatusName(sheetStatus)
      })
    }
  }

  @Watch('hits')
  onChangeHitList(newVal: number[], oldVal: number[]) {
    this.refreshTableItems()
  }

  loadEntries() {
    AppUtil.loadGame().then(() => {
      BingoLogic.loadEntries().then(() => {
        this.refreshTableItems()
      })
    })
  }
}
</script>

<style scoped lang="scss"></style>
