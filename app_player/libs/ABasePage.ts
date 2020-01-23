import { Component, Vue } from 'vue-property-decorator'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'
import AppUtil from '~/libs/AppUtil'
import UtilDate from '~/../common/libs/UtilDate'

export default class ABasePage extends Vue {
  protected commonBeforeMount() {
    if (!generalStateModule.isAuthorized) {
      return this.$router.push({ path: '/login' })
    } else if (!generalStateModule.isRegistered) {
      return this.$router.push({ path: '/' })
    } else {
      return Promise.resolve(true)
    }
  }
}
