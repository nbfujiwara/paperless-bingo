import { IUser } from '~/../common/interfaces/IUser'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'
import AppUtil from '~/libs/AppUtil'
import { IGame } from '~/../common/interfaces/IGame'

export default class BingoLogic {
  static GAME_ID: string = '1'
  public static entry(user: IUser) {
    const sheet = BingoLogic.createRandomBingoSheet()
    const entry = { user, sheet }
    basicStateModule.setSheet(sheet)
    return AppUtil.FBMng.saveEntry(entry).then(() => {
      generalStateModule.setToastMessage('参加しました')
    })
  }

  private static createRandomBingoSheet(): number[] {
    const createRandomArray = (
      min: number,
      max: number,
      center: boolean = false
    ): number[] => {
      const lottery: number[] = []
      const randomArray: number[] = []
      for (let i = min; i <= max; i++) {
        lottery.push(i)
      }

      for (let row = 0; row < 5; row++) {
        if (center && row === 2) {
          randomArray.push(0)
        } else {
          const randomIndex = Math.floor(Math.random() * lottery.length)
          randomArray.push(lottery[randomIndex])
          lottery.splice(randomIndex, 1)
        }
      }
      return randomArray
    }
    const listB: number[] = createRandomArray(1, 15)
    const listI: number[] = createRandomArray(16, 30)
    const listN: number[] = createRandomArray(31, 45, true)
    const listG: number[] = createRandomArray(46, 60)
    const listO: number[] = createRandomArray(61, 75)
    return listB
      .concat(listI)
      .concat(listN)
      .concat(listG)
      .concat(listO)
  }
  public static convertSheet2D(array: number[]): number[][] {
    if (array.length !== 25) {
      console.error('incorrect bingo array', array)
      throw new Error('Bingo想定外データが入ってきました')
    }
    const sheet2D: number[][] = []
    for (let row = 0; row < 5; row++) {
      sheet2D[row] = []
      for (let col = 0; col < 5; col++) {
        sheet2D[row][col] = array[row + col * 5]
      }
    }
    return sheet2D
  }

  public static watchGameChanges() {
    const listener = AppUtil.FBMng.watchGameHits(
      BingoLogic.GAME_ID,
      (newGame: IGame) => {
        if (
          newGame.hits.length &&
          newGame.hits.length !== basicStateModule.game.hits.length
        ) {
          generalStateModule.setToastMessage(
            '抽選番号『' + newGame.hits[newGame.hits.length - 1] + '』'
          )
        }
        basicStateModule.setGame(newGame)
      }
    )
  }
}
