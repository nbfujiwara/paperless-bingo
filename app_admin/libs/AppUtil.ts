import FirebaseManager from './FirebaseManager'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'

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
        return AppUtil.FBMng.getLogonData().then((logonData) => {
          if (logonData) {
            if (logonData.adminUser) {
              basicStateModule.setAdminUser(logonData.adminUser)
            }
            if (logonData.role && logonData.role > 0) {
              generalStateModule.setHasRole(true)
            }
          }
        })
      }
    })
  }
}
