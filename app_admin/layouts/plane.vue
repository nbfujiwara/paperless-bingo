<template>
  <v-app light>
    <v-content>
      <v-container fill-height pa-0 class="rootContainer text-center">
        <nuxt />
      </v-container>
    </v-content>
    <page-toast></page-toast>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    PageToast: () => import('~/components/PageToast.vue')
  }
})
export default class PlaneLayout extends Vue {}
</script>
