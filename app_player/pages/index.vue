<template>
  <div class="myContainer">
    <div>
      <h1 class="title">
        ペーパーレスBingo
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
import { Component, Vue } from 'vue-property-decorator'
import AppUtil from '~/libs/AppUtil'
import { generalStateModule } from '~/store/modules/general'

@Component({
  layout: 'plane'
})
export default class IndexPage extends Vue {
  mounted() {
    AppUtil.handlingAuth().then(() => {
      if (generalStateModule.isRegistered) {
        this.$router.push({ path: '/main' })
      } else if (generalStateModule.isAuthorizedSuccess) {
        this.$router.push({ path: '/signup' })
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
