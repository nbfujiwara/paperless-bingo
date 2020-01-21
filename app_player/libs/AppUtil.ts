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


  /*
  public static loadTodayVisitList() {
    return AppUtil.FBMng.getTodayVisits().then((list) => {
      databaseStateModule.setTodayVisitList(list)
    })
  }
  public static loadCurrentPet(petId: string) {
    return AppUtil.FBMng.getPet(petId).then((data) => {
      basicStateModule.setCurrentPet(data)
    })
  }

  public static loadShopPhysicalList() {
    if (!basicStateModule.currentPet || !basicStateModule.currentPet.petId) {
      throw new Error('current pet id is null')
    }
    return AppUtil.FBMng.getShopPhysicals(
      basicStateModule.currentPet.petId
    ).then((list) => {
      databaseStateModule.setShopPhysicalList(list)
    })
  }
  public static loadShopCareList() {
    if (!basicStateModule.currentPet || !basicStateModule.currentPet.petId) {
      throw new Error('current pet id is null')
    }
    return AppUtil.FBMng.getShopCares(basicStateModule.currentPet.petId).then(
      (list) => {
        databaseStateModule.setShopCareList(list)
      }
    )
  }
  public static loadShopHealthList() {
    if (!basicStateModule.currentPet || !basicStateModule.currentPet.petId) {
      throw new Error('current pet id is null')
    }
    return AppUtil.FBMng.getShopHealths(basicStateModule.currentPet.petId).then(
      (list) => {
        databaseStateModule.setShopHealthList(list)
      }
    )
  }
  public static loadShopFoodList() {
    if (!basicStateModule.currentPet || !basicStateModule.currentPet.petId) {
      throw new Error('current pet id is null')
    }
    return AppUtil.FBMng.getShopFoods(basicStateModule.currentPet.petId).then(
      (list) => {
        databaseStateModule.setShopFoodList(list)
      }
    )
  }
  public static loadShopHotelList() {
    if (!basicStateModule.currentPet || !basicStateModule.currentPet.petId) {
      throw new Error('current pet id is null')
    }
    return AppUtil.FBMng.getShopHotels(basicStateModule.currentPet.petId).then(
      (list) => {
        databaseStateModule.setShopHotelList(list)
      }
    )
  }

  public static saveShopPhysical(data: IShopPhysical) {
    return AppUtil.FBMng.saveShopPhysical(data).then(async (savedId) => {
      generalStateModule.setToastMessage('身体測定情報を保存しました')
      await AppUtil.loadShopPhysicalList()
      return savedId
    })
  }
  public static saveShopCare(data: IShopCare) {
    return AppUtil.FBMng.saveShopCare(data).then(async (savedId) => {
      generalStateModule.setToastMessage('ケアレポートを保存しました')
      await AppUtil.loadShopCareList()
      return savedId
    })
  }
  public static saveShopHealth(data: IShopHealth) {
    return AppUtil.FBMng.saveShopHealth(data).then(async (savedId) => {
      generalStateModule.setToastMessage('健康チェック情報を保存しました')
      await AppUtil.loadShopHealthList()
      return savedId
    })
  }
  public static saveShopFood(data: IShopFood) {
    return AppUtil.FBMng.saveShopFood(data).then(async (savedId) => {
      generalStateModule.setToastMessage('フード購入情報を保存しました')
      await AppUtil.loadShopFoodList()
      return savedId
    })
  }
  public static saveShopHotel(data: IShopHotel) {
    return AppUtil.FBMng.saveShopHotel(data).then(async (savedId) => {
      generalStateModule.setToastMessage('ホテル利用情報を保存しました')
      await AppUtil.loadShopHotelList()
      return savedId
    })
  }

  public static savePhotos(date: Date, files: File[]) {
    return AppUtil.FBMng.saveAddPhotos(date, files).then((count) => {
      generalStateModule.setToastMessage(
        count + 'ファイルをアップロードしました'
      )
    })
  }
  public static loadPhotoDailySummary() {
    return AppUtil.FBMng.getAllPhotos().then((allList) => {
      const dailyHash: any = {}
      for (const photo of allList) {
        const ymd = UtilDate.format(photo.photoDate, 'Ymd')
        if (!dailyHash[ymd]) {
          dailyHash[ymd] = {
            photoDate: photo.photoDate,
            totalCount: 0,
            linkCount: 0,
            unlinkCount: 0
          }
        }
        dailyHash[ymd].totalCount++
        if (photo.petIds.length) {
          dailyHash[ymd].linkCount++
        } else {
          dailyHash[ymd].unlinkCount++
        }
      }

      const list: IPhotoDailySummary[] = Object.values(dailyHash)
      databaseStateModule.setPhotoDailySummaryList(list)
    })
  }
  public static loadPhotoList(date: Date) {
    console.log('load photo start')
    databaseStateModule.setPhotoList([])
    return AppUtil.FBMng.getPhotoListByDate(date).then((list) => {
      console.log('loaded photo write to store')
      databaseStateModule.setPhotoList(list)
    })
  }
  public static loadDailyPetList(date: Date) {
    return AppUtil.FBMng.getDailyPetList(date).then((list) => {
      databaseStateModule.setDailyPetList(list)
    })
  }
  public static saveLinkPhotoPet(photoId: string, petId: string) {
    return AppUtil.FBMng.saveLinkPhotoPet(photoId, [petId]).then(() => {
      generalStateModule.setToastMessage('写真とペットを紐付けました')
    })
  }
  public static saveUnLinkPhotoPet(photoId: string) {
    return AppUtil.FBMng.saveLinkPhotoPet(photoId, []).then(() => {
      generalStateModule.setToastMessage('写真とペットの紐付を解除しました')
    })
  }

 */
}
