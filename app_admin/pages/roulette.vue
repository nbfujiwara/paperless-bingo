<template>
  <div class="myContainer">
    <div v-show="displayStatus === DS_LIST">
      <template v-for="(obj, idx) in numberList">
        <br v-if="idx % 15 === 0" />
        <div v-if="idx === 0" class="cell bingo">B</div>
        <div v-if="idx === 15" class="cell bingo">I</div>
        <div v-if="idx === 30" class="cell bingo">N</div>
        <div v-if="idx === 45" class="cell bingo">G</div>
        <div v-if="idx === 60" class="cell bingo">O</div>
        <div
          :class="{ hit: obj.hit, lastHit: lastHitNum === obj.num }"
          class="cell number"
        >
          {{ obj.num }}
        </div>
      </template>

      <div>
        <v-btn @click="startRoll" class="primary mt-10" x-large rounded
          >抽選</v-btn
        >
      </div>
    </div>
    <div v-show="displayStatus === DS_ROLL" @click="decideHit">
      <span class="rollNum">{{ rollNum }}</span>
    </div>
    <div v-show="displayStatus === DS_HIT" @click="backList">
      <span class="rollNum">{{ rollNum }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import AppUtil from '~/libs/AppUtil'
import ABasePage from '~/libs/ABasePage'
import BingoLogic from '~/libs/BingoLogic'
import { basicStateModule } from '~/store/modules/basic'

@Component({
  layout: 'plane'
})
export default class RoulettePage extends ABasePage {
  private DS_LIST = 1
  private DS_ROLL = 2
  private DS_HIT = 3
  private displayStatus = this.DS_LIST
  private rollNum = 1
  private rollTimer: any

  private numberList: { num: number; hit: boolean }[] = []

  get hitList() {
    return basicStateModule.game.hits
  }
  get lastHitNum() {
    const len = basicStateModule.game.hits.length
    if (len) {
      return basicStateModule.game.hits[len - 1]
    }
    return null
  }

  beforeMount() {
    this.commonBeforeMount()
  }

  mounted() {
    AppUtil.loadGame().then(() => {
      for (let num = 1; num <= 75; num++) {
        this.numberList.push({ num, hit: this.hitList.includes(num) })
      }
    })
  }

  startRoll() {
    this.displayStatus = this.DS_ROLL
    this.rollTimer = setInterval(() => {
      this.rollNum = Math.ceil(Math.random() * 75)
    }, 100)
  }
  decideHit() {
    BingoLogic.drawRandomNumber().then((hitNum) => {
      clearInterval(this.rollTimer)
      this.rollNum = hitNum
      this.displayStatus = this.DS_HIT

      const hitIdx = hitNum - 1
      const item = this.numberList[hitIdx]
      item.hit = true
      this.numberList.splice(hitIdx, 1, item)
    })
  }
  backList() {
    this.displayStatus = this.DS_LIST
  }
}
</script>

<style scoped lang="scss">
.myContainer {
  width: 100%;
}
.cell {
  display: inline-block;
  width: 4vw;
  height: 4vw;
  line-height: 4vw;
  border-radius: 100px;
  font-size: 2.5vw;
  margin-top: 10px;

  &.bingo {
    background-color: #001d6c;
    color: #ffffff;
    margin-right: 10px;
  }
  &.number {
    border: 1px solid #cccccc;
    color: #cccccc;
    &.hit {
      border: none;
      background-color: #007979;
      color: #ffffff;
    }
    &.lastHit {
      background-color: #ff4500;
    }
  }
}

.rollNum {
  font-size: 30vh;
}
</style>
