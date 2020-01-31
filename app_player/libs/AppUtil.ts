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

  public static startAuthUI(
    element: string,
    successCallback: Function,
    uiShownCallback: Function | null = null
  ) {
    AppUtil.FBMng.startUI(
      element,
      (authResult: any) => {
        // firebaseUIにしたらauthorizeとauthorizedSuccessが同タイミングになってしまった
        generalStateModule.setIsAuthorized(true)
        generalStateModule.setIsAuthorizedSuccess(true)
        AppUtil.FBMng.getLogonData().then((entryData) => {
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
            successCallback()
          }
        })
      },
      uiShownCallback
    )
  }
}
