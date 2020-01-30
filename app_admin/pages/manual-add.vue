<template>
  <div class="containerWithHeader">
    <page-header title-text="HOME"></page-header>
    <div class="main">
      <v-text-field v-model="num" outlined></v-text-field>
      <v-btn @click="saveNumber" class="primary">ヒット</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ABasePage from '~/libs/ABasePage'
import BingoLogic from '~/libs/BingoLogic'

@Component({
  components: {
    PageHeader: () => import('~/components/PageHeader.vue')
  }
})
export default class HomePage extends ABasePage {
  private num: string = ''

  beforeMount() {
    this.commonBeforeMount()
  }
  saveNumber() {
    BingoLogic.drawNumber(Number(this.num)).then(() => {
      this.num = ''
    })
  }
}
</script>

<style scoped lang="scss"></style>
