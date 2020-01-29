import { IEntry } from '~/../common/interfaces/IEntry'
import { IGame } from '~/../common/interfaces/IGame'
import { IAdminUser } from '~/../common/interfaces/IAdminUser'

export interface IRootState {
  general: IGeneralState
  basic: IBasicState
}

export interface IGeneralState {
  isAuthorized: boolean
  isAuthorizedSuccess: boolean
  hasRole: boolean
  toastMessage: string
  toastNo: number
}

export interface IBasicState {
  adminUser: IAdminUser
  game: IGame | null
  entries: IEntry[]
}
