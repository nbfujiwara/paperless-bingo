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
import { IBingoCell } from '~/../common/interfaces/IBingoCell'

@Module({ dynamic: true, store, name: 'basic', namespaced: true })
class Basic extends VuexModule implements IBasicState {
  user: IUser = { name: '', mail: '', departmentId: 0 }
  sheet: number[] = []
  sheetCells: IBingoCell[][] = []
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
  private SET_SHEET_CELLS(val: IBingoCell[][]) {
    this.sheetCells = val
  }
  @Mutation
  private SET_SHEET_CELL(val: { row: number; col: number; item: IBingoCell }) {
    this.sheetCells[val.row].splice(val.col, 1, val.item)
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
  public setSheetCells(val: IBingoCell[][]) {
    this.SET_SHEET_CELLS(val)
  }
  @Action({})
  public putSheetCellHit(val: { row: number; col: number }) {
    const item = this.sheetCells[val.row][val.col]
    item.hit = true
    this.SET_SHEET_CELL({ row: val.row, col: val.col, item })
  }
  @Action({})
  public putSheetCellOpened(val: { row: number; col: number }) {
    const item = this.sheetCells[val.row][val.col]
    item.opened = true
    this.SET_SHEET_CELL({ row: val.row, col: val.col, item })
  }
  @Action({})
  public setGame(val: IGame) {
    this.SET_GAME(val)
  }
}

export const basicStateModule = getModule(Basic)
