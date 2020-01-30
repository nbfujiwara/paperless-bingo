import { Component, Vue } from 'vue-property-decorator'
import { generalStateModule } from '~/store/modules/general'
import AppUtil from '~/libs/AppUtil'
import BingoLogic from '~/libs/BingoLogic'

export default class ABasePage extends Vue {
  protected commonBeforeMount() {
    if (!generalStateModule.isAuthorized) {
      return AppUtil.handlingAuth()
        .then(() => {
          if (generalStateModule.hasRole) {
            return true
          } else {
            AppUtil.FBMng.loginRedirect()
            return false
          }
        })
        .then((hasRole) => {
          if (hasRole) {
            return BingoLogic.loadGame()
          }
        })
    } else if (!generalStateModule.hasRole) {
      this.$router.push({ path: '/' })
      return Promise.resolve(false)
    } else {
      return Promise.resolve(true)
    }
  }
}
