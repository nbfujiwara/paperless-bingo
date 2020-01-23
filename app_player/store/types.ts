import { IBingoCell } from '~/../common/interfaces/IBingoCell'
import { IGame } from '~/../common/interfaces/IGame'
import { IUser } from '~/../common/interfaces/IUser'

export interface IRootState {
  general: IGeneralState
  basic: IBasicState
}

export interface IGeneralState {
  isAuthorized: boolean
  isAuthorizedSuccess: boolean
  isRegistered: boolean
  toastMessage: string
  toastNo: number
}

export interface IBasicState {
  user: IUser
  sheet: number[]
  sheetCells: IBingoCell[][]
  game: IGame
}
