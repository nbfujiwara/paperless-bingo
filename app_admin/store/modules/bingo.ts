import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module
} from 'vuex-module-decorators'
import { IEntry } from '../../../common/interfaces/IEntry'
import store from '~/store/store'
import { IBingoState } from '~/store/types'
import { IGame } from '~/../common/interfaces/IGame'

@Module({ dynamic: true, store, name: 'bingo', namespaced: true })
class Database extends VuexModule implements IBingoState {
  game: IGame = { hits: [], started: false }
  entries: IEntry[] = []

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

export const bingoStateModule = getModule(Database)
