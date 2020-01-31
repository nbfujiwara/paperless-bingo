import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { IEntry } from '../../common/interfaces/IEntry'
import UtilDate from '~/../common/libs/UtilDate'

export default class FirebaseManager {
  private db: firebase.firestore.Firestore
  private authResultCache: firebase.auth.UserCredential | null = null
  private authUI: firebaseui.auth.AuthUI

  public constructor() {
    const apiKey = process.env.ENV_FB_API_KEY
    const projectId = process.env.ENV_FB_PROJECT_ID
    const authDomain = projectId + '.firebaseapp.com'
    const databaseURL = 'https://' + projectId + '.firebaseio.com'
    const storageBucket = projectId + '.appspot.com'
    const messagingSenderId = process.env.ENV_FB_MESSAGE_SENDER_ID

    const config = {
      apiKey,
      authDomain,
      databaseURL,
      projectId,
      storageBucket,
      messagingSenderId
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
    this.db = firebase.firestore()
  }
  public startUI(
    element: string,
    successCallback: Function,
    uiShownCallback: Function | null = null
  ) {
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult(authResult: any, redirectUrl: any) {
          if (authResult.user) {
            successCallback(authResult)
          } else {
            console.error('authResult user is empty', authResult)
          }
          return false
        },
        uiShown() {
          if (uiShownCallback) {
            uiShownCallback()
          }
        }
      },
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
          signInMethod:
            firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
        },
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ]
    }
    return this.generateAuthUI().start(element, uiConfig)
  }
  private generateAuthUI() {
    if (this.authUI) {
      return this.authUI
    }
    this.authUI = new firebaseui.auth.AuthUI(firebase.auth())
    return this.authUI
  }

  public logout() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        window.location.href = '/'
      })
      .catch(function(error) {
        console.error(error)
      })
  }

  public getCurrentUser() {
    return firebase.auth().currentUser
  }
  public getLogonData() {
    const authUser = this.getCurrentUser()
    if (!authUser) {
      throw new Error('auth user is null')
    }
    const userId = authUser.uid
    let entry: IEntry = {
      user: { name: '', mail: '', departmentId: 0 },
      sheet: []
    }
    return this.db
      .collection('entries')
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          entry = this.commonParseDoc(doc.data())
        } else {
          if (authUser.email !== null) {
            entry.user.mail = authUser.email
          }
          if (authUser.displayName) {
            entry.user.name = authUser.displayName
          }
        }
      })
      .then(() => {
        return entry
      })
  }

  public getGame(gameId: string) {
    return this.db
      .collection('games')
      .doc(gameId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return this.commonParseDoc(doc.data())
        } else {
          return {}
        }
      })
  }
  public saveEntry(entry: IEntry) {
    const authUser = this.getCurrentUser()
    if (!authUser) {
      throw new Error('auth user is null')
    }
    return this.db
      .collection('entries')
      .doc(authUser.uid)
      .set(entry)
  }
  public saveEntrySheet(sheet: number[]) {
    const authUser = this.getCurrentUser()
    if (!authUser) {
      throw new Error('auth user is null')
    }
    return this.db
      .collection('entries')
      .doc(authUser.uid)
      .set({ sheet }, { merge: true })
  }

  public watchGameHits(gameId: string, callback: Function) {
    return this.db
      .collection('games')
      .doc(gameId)
      .onSnapshot((doc) => {
        console.info('games変更検知', doc.data())
        callback(doc.data())
      })
  }

  /**
   * firebaseの型をJS用に変換する共通関数
   * @param obj
   * @returns any
   */
  private commonParseDoc(obj: any) {
    Object.entries(obj).forEach(([key, val]) => {
      if (val instanceof Object) {
        if (val.constructor.name === 'Timestamp') {
          obj[key] = UtilDate.parseFirebase(val)
        } else if (val.hasOwnProperty('seconds')) {
          // constructor == timestampでひっかからんときがある
          obj[key] = UtilDate.parseFirebase(val)
        }
      }
    })
    return obj
  }
}
