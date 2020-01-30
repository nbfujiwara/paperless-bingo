<template>
  <div class="myContainer">
    <div>
      <h1 class="title">
        ペーパーレスBingo管理側
      </h1>
      <h2 class="subtitle">
        Please wait...
      </h2>
      <v-progress-linear
        color="primary"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import AppUtil from '~/libs/AppUtil'
import ABasePage from '~/libs/ABasePage'
import { generalStateModule } from '~/store/modules/general'

@Component({
  layout: 'plane'
})
export default class IndexPage extends ABasePage {
  mounted() {
    AppUtil.handlingAuth().then(() => {
      if (generalStateModule.hasRole) {
        this.$router.push({ path: '/home' })
      } else {
        this.$router.push({ path: '/login' })
      }
    })
  }
}
</script>
<style scoped lang="scss">
.myContainer {
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
