import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { IAdminLogonData } from '../../common/interfaces/IAdminLogonData'
import { IEntry } from '../../common/interfaces/IEntry'
import UtilDate from '~/../common/libs/UtilDate'
import { IAdminUser } from '~/../common/interfaces/IAdminUser'
import { IGame } from '~/../common/interfaces/IGame'

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
      return firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return firebase
            .auth()
            .getRedirectResult()
            .then((result: firebase.auth.UserCredential) => {
              this.authorized = true
              if (result.user) {
                this.authResultCache = result
                return result
              } else {
                this.authResultCache = null
                return null
              }
            })
        })
    }
  }
  public loginRedirect() {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
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
    let logonUser: IAdminUser = { name: '', mail: '' }
    return this.db
      .collection('adminUsers')
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          logonUser = this.commonParseDoc(doc.data())
        } else {
          if (authUser.email != null) {
            logonUser.mail = authUser.email
          }
          if (this.authResultCache && this.authResultCache.additionalUserInfo) {
            // @ts-ignore
            logonUser.name = this.authResultCache.additionalUserInfo.profile.name
          }
          return this.db
            .collection('adminUsers')
            .doc(userId)
            .set(logonUser)
        }
      })
      .then(() => {
        return this.db
          .collection('adminUserRoles')
          .doc(userId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // @ts-ignore
              return doc.data().role
            } else {
              return null
            }
          })
      })
      .then(
        (role): IAdminLogonData => {
          return { adminUser: logonUser, role }
        }
      )
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
          return null
        }
      })
  }
  public saveGame(gameId: string, game: IGame) {
    return this.db
      .collection('games')
      .doc(gameId)
      .set(game)
  }
  public savePushGameHit(gameId: string, num: number) {
    return this.db
      .collection('games')
      .doc(gameId)
      .update({ hits: firebase.firestore.FieldValue.arrayUnion(num) })
  }

  public getEntries() {
    return this.db
      .collection('entries')
      .get()
      .then((querySnapshot) => {
        const list: IEntry[] = []
        querySnapshot.forEach((doc) => {
          const row: IEntry = this.commonParseDoc(doc.data())
          list.push(row)
        })
        return list
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
