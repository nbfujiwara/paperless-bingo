import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module
} from 'vuex-module-decorators'
import { IGame } from '../../../common/interfaces/IGame'
import store from '~/store/store'
import { IBasicState } from '~/store/types'
import { IUser } from '~/../common/interfaces/IUser'

@Module({ dynamic: true, store, name: 'basic', namespaced: true })
class Basic extends VuexModule implements IBasicState {
  user: IUser = { name: '', mail: '', department: '' }
  sheet: number[] = []
  game: IGame = { hits: [], started: false }

  @Mutation
  private SET_USER(val: IUser) {
    this.user = val
  }
  @Mutation
  private SET_SHEET(val: number[]) {
    this.sheet = val
  }
  @Mutation
  private SET_GAME(val: IGame) {
    this.game = val
  }

  @Action({})
  public setUser(val: IUser) {
    this.SET_USER(val)
  }
  @Action({})
  public setSheet(val: number[]) {
    this.SET_SHEET(val)
  }
  @Action({})
  public setGame(val: IGame) {
    this.SET_GAME(val)
  }
}

export const basicStateModule = getModule(Basic)
