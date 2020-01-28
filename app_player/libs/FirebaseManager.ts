import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { IEntry } from '../../common/interfaces/IEntry'
import UtilDate from '~/../common/libs/UtilDate'

export default class FirebaseManager {
  private db: firebase.firestore.Firestore
  private authResultCache: firebase.auth.UserCredential | null = null
  private authorized: boolean = false

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
  public sendMailForAuth(email: string) {
    const actionCodeSettings = {
      url: String(process.env.ENV_BASE_URL),
      handleCodeInApp: true
    }
    return firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(function() {
        window.localStorage.setItem('emailForSignIn', email)
      })
  }
  private getLocalEmailForSignIn(): string {
    return String(window.localStorage.getItem('emailForSignIn'))
  }
  private isEnableSignInWithEmailLink() {
    return (
      firebase.auth().isSignInWithEmailLink(window.location.href) &&
      this.getLocalEmailForSignIn()
    )
  }
  public signInWithEmailLink() {}

  /**
   * 認証成功失敗に関わらず既に試みたかどうか
   */
  public isAuthorized() {
    return this.authorized
  }

  /**
   * 認証実行
   */
  public authorize() {
    if (this.authorized) {
      return new Promise((resolve) => {
        resolve(this.authResultCache)
      })
    } else {
      return Promise.resolve()
        .then(() => {
          if (this.isEnableSignInWithEmailLink()) {
            console.log('authorize by email')
            const email = this.getLocalEmailForSignIn()
            return firebase
              .auth()
              .signInWithEmailLink(email, window.location.href)
          } else {
            console.log('authorize by oauth')
            return firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
              .then(() => {
                return firebase.auth().getRedirectResult()
              })
          }
        })
        .then((result: firebase.auth.UserCredential) => {
          console.log('receive authorize result', result)
          this.authorized = true
          if (result.user) {
            this.authResultCache = result
            return result
          } else {
            this.authResultCache = null
            return null
          }
        })
    }
  }
  public loginRedirect() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithRedirect(provider)
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
          console.log(authUser)
          if (authUser.email != null) {
            entry.user.mail = authUser.email
          } else if (this.getLocalEmailForSignIn()) {
            entry.user.mail = this.getLocalEmailForSignIn()
          }
          if (
            this.authResultCache &&
            this.authResultCache.additionalUserInfo &&
            this.authResultCache.additionalUserInfo.profile
          ) {
            // @ts-ignore
            entry.user.name = this.authResultCache.additionalUserInfo.profile.name
          }
        }
      })
      .then(() => {
        return entry
      })
      .catch((error) => {
        console.log(error)
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
