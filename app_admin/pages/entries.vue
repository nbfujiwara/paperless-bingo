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
import { Component, Vue } from 'vue-property-decorator'
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
  get tableHeaders(): { [s: string]: any }[] {
    return [
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
            value: 'isReach'
        }
    ]
  }
  get tableItems(): { [s: string]: any }[] {
    const list = []
    for (const entry of bingoStateModule.entries) {
      const department = MasterDao.department(entry.user.departmentId)
      let departmentName = ''
      if (department) {
        departmentName = department.name
        if (department.withText && entry.user.departmentEtcText) {
          departmentName += '(' + entry.user.departmentEtcText + ')'
        }
      }
      list.push({
        name: entry.user.name,
        mail: entry.user.mail,
        department: departmentName,
        sheet: entry.sheet,
        isReach: false,
        isBingo: false
      })
    }
    return list
  }

  loadEntries() {
    BingoLogic.loadEntries()
  }
}
</script>

<style scoped lang="scss"></style>
