<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="2000">
      {{ toastMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { generalStateModule } from '~/store/modules/general'

@Component
export default class PageToast extends Vue {
  private snackbar: boolean = false
  private toastMessage: string = ''
  get toastNo() {
    return generalStateModule.toastNo
  }
  @Watch('toastNo')
  onChanged(newVal: any, oldVal: any) {
    this.toastMessage = generalStateModule.toastMessage
    this.snackbar = true
  }
}
</script>
