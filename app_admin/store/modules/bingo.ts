import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module
} from 'vuex-module-decorators'
import store from '~/store/store'
import { IBingoState } from '~/store/types'
import { IGame } from '~/../common/interfaces/IGame'

@Module({ dynamic: true, store, name: 'bingo', namespaced: true })
class Database extends VuexModule implements IBingoState {
  game: IGame = { hits: [], started: false }

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
}

export const bingoStateModule = getModule(Database)
