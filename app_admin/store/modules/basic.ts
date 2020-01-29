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
import { IGame } from '~/../common/interfaces/IGame'
import { IEntry } from '~/../common/interfaces/IEntry'

@Module({ dynamic: true, store, name: 'basic', namespaced: true })
class Basic extends VuexModule implements IBasicState {
  adminUser: IAdminUser = { name: '', mail: '' }
  game: IGame = { hits: [], started: false }
  entries: IEntry[] = []

  @Mutation
  private SET_ADMIN_USER(val: IAdminUser) {
    this.adminUser = val
  }
  @Mutation
  private SET_GAME(val: IGame) {
    this.game = val
  }
  @Mutation
  private PUSH_HIT(val: number) {
    this.game.hits.push(val)
  }
  @Mutation
  private SET_GAME_STARTED(val: boolean) {
    this.game.started = val
  }
  @Mutation
  private SET_ENTRIES(val: IEntry[]) {
    this.entries = val
  }

  @Action({})
  public setAdminUser(val: IAdminUser) {
    this.SET_ADMIN_USER(val)
  }
  @Action({})
  public setGame(val: IGame) {
    this.SET_GAME(val)
  }
  @Action({})
  public startGame() {
    this.SET_GAME_STARTED(true)
  }
  @Action({})
  public pushHit(val: number) {
    this.PUSH_HIT(val)
  }
  @Action({})
  public setEntries(val: IEntry[]) {
    this.SET_ENTRIES(val)
  }
}

export const basicStateModule = getModule(Basic)
