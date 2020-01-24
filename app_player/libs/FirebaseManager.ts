import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { IAdminLogonData } from '../../common/interfaces/IAdminLogonData'
import { IEntry } from '../../common/interfaces/IEntry'
import UtilDate from '~/../common/libs/UtilDate'
import { IUser } from '~/../common/interfaces/IUser'
import { IGame } from '~/../common/interfaces/IGame'
import functions from '~/node_modules/firebase'
import CollectionReference = firebase.firestore.CollectionReference

export default class FirebaseManager {
  private db: firebase.firestore.Firestore
  private authResultCache: firebase.auth.UserCredential | null = null
  private authorized: boolean = false
  private static firebaseInitialized: boolean = false

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
    console.log(config)

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
  private isEnableSignInWithEmailLink() {
    return (
      firebase.auth().isSignInWithEmailLink(window.location.href) &&
      window.localStorage.getItem('emailForSignIn')
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
            const email = String(window.localStorage.getItem('emailForSignIn'))
            return firebase
              .auth()
              .signInWithEmailLink(email, window.location.href)
          } else {
            return firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
              .then(() => {
                return firebase.auth().getRedirectResult()
              })
          }
        })
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
/*
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

 */
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
    let entry: IEntry = {
      user: { name: '', mail: '', department: '' },
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
          if (authUser.email != null) {
            entry.user.mail = authUser.email
          }
          if (this.authResultCache && this.authResultCache.additionalUserInfo) {
            // @ts-ignore
            entry.user.name = this.authResultCache.additionalUserInfo.profile.name
          }
          return this.db
            .collection('entries')
            .doc(userId)
            .set(entry)
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

  /*

  public getTodayVisits() {
    const tgDate = new Date()
    tgDate.setDate(tgDate.getDate() - 1)

    return this.db
      .collection('visits')
      .where('visitDate', '>', tgDate)
      .get()
      .then((querySnapshot) => {
        const list: IVisitPet[] = []
        querySnapshot.forEach((doc) => {
          const row = this.commonParseDoc(doc.data())
          list.push({ petId: row.petId, visitDate: row.visitDate })
        })
        return list
      })
      .then(async (list: IVisitPet[]) => {
        for (const row of list) {
          await this.getPet(row.petId).then((pet) => {
            row.pet = pet
          })
        }
        return list
      })
  }
  public getPet(petId: string) {
    return this.db
      .collection('pets')
      .doc(petId)
      .get()
      .then(async (doc) => {
        const pet: IPet = this.commonParseDoc(doc.data())
        pet.petId = petId
        if (pet.avatarImagePath) {
          await this.getStorageUrl(pet.avatarImagePath).then((url) => {
            pet.avatarImageUrl = url
          })
        }
        return pet
      })
  }

  public getShopPhysicals(petId: string): Promise<IShopPhysical[]> {
    // @ts-ignore
    return this.getShopDataListCommon(petId, 'shopPhysicals')
  }
  public getShopCares(petId: string): Promise<IShopCare[]> {
    // @ts-ignore
    return this.getShopDataListCommon(petId, 'shopCares')
  }
  public getShopHealths(petId: string): Promise<IShopHealth[]> {
    // @ts-ignore
    return this.getShopDataListCommon(petId, 'shopHealths')
  }
  public getShopFoods(petId: string): Promise<IShopFood[]> {
    // @ts-ignore
    return this.getShopDataListCommon(petId, 'shopFoods')
  }
  public getShopHotels(petId: string): Promise<IShopHotel[]> {
    // @ts-ignore
    return this.getShopDataListCommon(petId, 'shopHotels')
  }

  private getShopDataListCommon(petId: string, collectionPath: string) {
    return this.db
      .collection(collectionPath)
      .where('petId', '==', petId)
      .orderBy('shopDate', 'desc')
      .get()
      .then((querySnapshot) => {
        const list: IShopBase[] = []
        querySnapshot.forEach((doc) => {
          const row: IShopBase = this.commonParseDoc(doc.data())
          row.docId = doc.id
          list.push(row)
        })
        return list
      })
  }

  public saveShopPhysical(data: IShopPhysical): Promise<void | string> {
    return this.saveShopDataCommon(data, 'shopPhysicals')
  }
  public saveShopCare(data: IShopCare): Promise<void | string> {
    return this.saveShopDataCommon(data, 'shopCares')
  }
  public saveShopHealth(data: IShopHealth): Promise<void | string> {
    return this.saveShopDataCommon(data, 'shopHealths')
  }
  public saveShopFood(data: IShopFood): Promise<void | string> {
    return this.saveShopDataCommon(data, 'shopFoods')
  }
  public saveShopHotel(data: IShopHotel): Promise<void | string> {
    return this.saveShopDataCommon(data, 'shopHotels')
  }

  private saveShopDataCommon(data: IShopBase, collectionPath: string) {
    const authUser = this.getCurrentUser()
    if (!authUser) {
      throw new Error('auth user is null')
    }
    if (!data.petId) {
      throw new Error('petID is null')
    }
    const ref: CollectionReference = this.db.collection(collectionPath)
    if (data.docId) {
      data.modified = new Date()
      return ref
        .doc(data.docId)
        .set(data, { merge: true })
        .then(() => {
          return data.docId
        })
    } else {
      data.created = new Date()
      data.modified = new Date()
      return ref.add(data).then((result) => {
        return result.id
      })
    }
  }

  public saveAddPhotos(date: Date, files: File[]) {
    const data = {
      photoDate: date,
      petIds: []
    }
    const ref: CollectionReference = this.db.collection('photos')
    let counter: number = 0
    return Promise.resolve()
      .then(async () => {
        for (const file of files) {
          await ref.add(data).then((result) => {
            if (result.id) {
              const filePath = 'photos/' + result.id + '/org'
              return firebase
                .storage()
                .ref(filePath)
                .put(file)
                .then((snapshot) => {
                  counter++
                  return true
                })
            } else {
              return false
            }
          })
        }
      })
      .then(() => {
        return counter
      })
  }
  public saveLinkPhotoPet(photoId: string, petIds: string[]) {
    const data = {
      petLinkDate: new Date(),
      petIds
    }
    return this.db
      .collection('photos')
      .doc(photoId)
      .set(data, { merge: true })
  }

  public getAllPhotos() {
    return this.db
      .collection('photos')
      .get()
      .then((querySnapshot) => {
        const list: IPhoto[] = []
        querySnapshot.forEach((doc) => {
          const row = this.commonParseDoc(doc.data())
          row.photoId = doc.id
          list.push(row)
        })
        return list
      })
  }
  public getPhotoListByDate(date: Date) {
    return (
      this.db
        .collection('photos')
        //      .where('photoDate', '==', date) なんか dateの===がうまくうごかない
        .get()
        .then((querySnapshot) => {
          console.log('success database result')
          const list: IPhoto[] = []
          querySnapshot.forEach((doc) => {
            const row = this.commonParseDoc(doc.data())
            if (
              UtilDate.format(row.photoDate, 'Ymd') ===
              UtilDate.format(date, 'Ymd')
            ) {
              row.photoId = doc.id
              list.push(row)
            }
          })
          return list
        })
        .then(async (list) => {
          console.log('path to url')
          for (const row of list) {
            const imagePath = 'photos/' + row.photoId + '/org'
            await this.getStorageUrl(imagePath).then((url) => {
              console.log('get url')
              row.imageUrl = url
            })
          }
          return list
        })
    )
  }
  public getDailyPetList(date: Date) {
    const startDate = date
    const endDate = UtilDate.parse(UtilDate.format(date, 'Y-m-d'))
    endDate.setDate(date.getDate() + 1)

    return this.db
      .collection('visits')
      .where('visitDate', '>=', startDate)
      .where('visitDate', '<', endDate)
      .get()
      .then((querySnapshot) => {
        const petIdHash: { [s: string]: boolean } = {}
        querySnapshot.forEach((doc) => {
          const row = this.commonParseDoc(doc.data())
          petIdHash[row.petId] = true
        })
        return Object.keys(petIdHash)
      })
      .then(async (petIdList: string[]) => {
        const list: IPet[] = []
        for (const petId of petIdList) {
          await this.getPet(petId).then((pet) => {
            list.push(pet)
          })
        }
        return list
      })
  }

  private getStorageUrl(path: string) {
    if (!path) {
      return Promise.resolve(null)
    }
    return firebase
      .storage()
      .ref(path)
      .getDownloadURL()
  }
  */

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
