import UtilDate from '../../common/libs/UtilDate'
import FirebaseManager from './FirebaseManager'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'
import BingoLogic from '~/libs/BingoLogic'

export default class AppUtil {
  private static _FBMng: FirebaseManager

  public static get FBMng(): FirebaseManager {
    if (!AppUtil._FBMng) {
      AppUtil._FBMng = new FirebaseManager()
    }
    return AppUtil._FBMng
  }

  public static handlingAuth() {
    generalStateModule.setIsAuthorized(true)
    return AppUtil.FBMng.authorize().then((authResult) => {
      if (authResult) {
        generalStateModule.setIsAuthorizedSuccess(true)
        return AppUtil.FBMng.getLogonData().then((entryData) => {
          if (entryData) {
            if (entryData.user) {
              basicStateModule.setUser(entryData.user)
            }
            if (entryData.sheet.length > 0) {
              basicStateModule.setSheet(entryData.sheet)
              generalStateModule.setIsRegistered(true)
            } else {
              generalStateModule.setIsRegistered(false)
            }
          }
        })
      }
    })
  }

  public static sendMailForAuth(email: string) {
    return AppUtil.FBMng.sendMailForAuth(email).then(() => {
      generalStateModule.setToastMessage('認証用リンクをメール送信しました')
    })
  }
}
