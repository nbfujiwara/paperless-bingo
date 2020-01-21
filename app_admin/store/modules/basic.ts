import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module
} from 'vuex-module-decorators'
import store from '~/store/store'
import { IBasicState } from '~/store/types'
import { IAdminUser } from '~/../common/interfaces/IAdminUser'

@Module({ dynamic: true, store, name: 'basic', namespaced: true })
class Basic extends VuexModule implements IBasicState {
  adminUser: IAdminUser = { name: '', mail: '' }

  @Mutation
  private SET_ADMIN_USER(val: IAdminUser) {
    this.adminUser = val
  }
  @Action({})
  public setAdminUser(val: IAdminUser) {
    this.SET_ADMIN_USER(val)
  }
}

export const basicStateModule = getModule(Basic)
