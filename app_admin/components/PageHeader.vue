<template>
  <div>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="titleText" />
      <v-spacer />
      <div class="flex-grow-1"></div>
      <v-btn nuxt to="/home" icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class PageHeader extends Vue {
  @Prop({
    type: String,
    required: true
  })
  public titleText: string
}
</script>
