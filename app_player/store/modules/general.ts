import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module
} from 'vuex-module-decorators'
import store from '~/store/store'
import { IGeneralState } from '~/store/types'

@Module({ dynamic: true, store, name: 'general', namespaced: true })
class General extends VuexModule implements IGeneralState {
  // state
  isAuthorized = false
  isAuthorizedSuccess = false
  isRegistered = false
  toastMessage = ''
  toastNo = 0

  @Mutation
  private SET_IS_AUTHORIZED(val: boolean) {
    this.isAuthorized = val
  }
  @Mutation
  private SET_IS_AUTHORIZED_SUCCESS(val: boolean) {
    this.isAuthorizedSuccess = val
  }
  @Mutation
  private SET_IS_REGISTERED(val: boolean) {
    this.isRegistered = val
  }
  @Mutation
  private SET_TOAST_MESSAGE(val: string) {
    this.toastMessage = val
  }
  @Mutation
  private SET_TOAST_NO(val: number) {
    this.toastNo = val
  }

  @Action({})
  public setIsAuthorized(val: boolean) {
    this.SET_IS_AUTHORIZED(val)
  }
  @Action({})
  public setIsAuthorizedSuccess(val: boolean) {
    this.SET_IS_AUTHORIZED_SUCCESS(val)
  }
  @Action({})
  public setIsRegistered(val: boolean) {
    this.SET_IS_REGISTERED(val)
  }
  @Action({})
  public setToastMessage(val: string) {
    this.SET_TOAST_MESSAGE(val)
    this.SET_TOAST_NO(this.toastNo + 1)
  }
}
export const generalStateModule = getModule(General)
