import { IBingoCell } from '../../common/interfaces/IBingoCell'
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
    return AppUtil.FBMng.saveEntry(entry).then(() => {
      generalStateModule.setIsRegistered(true)
      basicStateModule.setSheet(sheet)
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

  public static generateSheetCells() {
    const numArray = basicStateModule.sheet
    if (numArray.length !== 25) {
      console.error('incorrect bingo array', numArray)
      throw new Error('Bingo想定外データになっています')
    }
    const sheetCells: IBingoCell[][] = []
    for (let row = 0; row < 5; row++) {
      sheetCells[row] = []
      for (let col = 0; col < 5; col++) {
        const num = numArray[row + col * 5]
        const cell: IBingoCell = {
          num,
          hit: false,
          opened: false
        }
        if (num === 0) {
          cell.hit = true
          cell.opened = true
          cell.center = true
        }
        sheetCells[row][col] = cell
      }
    }
    console.log('set sheet cells')
    basicStateModule.setSheetCells(sheetCells)
    console.log(basicStateModule.sheetCells)
  }

  public static initializeLocalGameState() {
    basicStateModule.setGame({ hits: [], started: false })
  }
  public static watchGameChanges() {
    const listener = AppUtil.FBMng.watchGameHits(
      BingoLogic.GAME_ID,
      (newGame: IGame) => {
        const newHits = newGame.hits
        const orgHits = basicStateModule.game.hits

        if (newHits.length && newHits.length !== orgHits.length) {
          const hitNum = newHits[newHits.length - 1]
          if (basicStateModule.sheet.includes(hitNum)) {
            generalStateModule.setToastMessage(
              '抽選番号『' + hitNum + '』ヤッタ！番号をタップして'
            )
          } else {
            generalStateModule.setToastMessage(
              '抽選番号『' + hitNum + '』　残念ハズレ。。。'
            )
          }

          for (let i = orgHits.length; i < newHits.length; i++) {
            BingoLogic.handlingAddedHitNum(newHits[i])
          }
        }
        basicStateModule.setGame(newGame)
      }
    )
  }

  private static handlingAddedHitNum(hitNum: number) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (basicStateModule.sheetCells[row][col].num === hitNum) {
          basicStateModule.putSheetCellHit({ row, col })
          return true
        }
      }
    }
    return false
  }

  public static openHitCell(row: number, col: number) {
    const cell = basicStateModule.sheetCells[row][col]
    if (cell.hit) {
      basicStateModule.putSheetCellOpened({ row, col })
      BingoLogic.checkBingoLine(row, col)
    }
  }
  private static checkBingoLine(targetRow: number, targetCol: number) {
    const isReach: boolean = false
    const isBingo: boolean = false

    const colLine: { row: number; col: number }[] = []
    const rowLine: { row: number; col: number }[] = []
    const diagonalLine: { row: number; col: number }[] = []
    const diagonalLBRTLine: { row: number; col: number }[] = []

    for (let i = 0; i < 5; i++) {
      if (i !== targetRow) {
        colLine.push({ row: i, col: targetCol })
      }
      if (i !== targetCol) {
        rowLine.push({ row: targetRow, col: i })
      }
      if (targetRow === targetCol && i !== targetRow) {
        diagonalLine.push({ row: i, col: i })
      }
      if (targetRow + targetCol === 4 && i !== targetRow) {
        diagonalLBRTLine.push({ row: i, col: 4 - i })
      }
    }

    const getOpenedCount = (line: { row: number; col: number }[]): number => {
      let cnt: number = 0
      for (const pos of line) {
        if (basicStateModule.sheetCells[pos.row][pos.col].opened) {
          cnt++
        }
      }
      return cnt
    }

    const colOpenedCount = getOpenedCount(colLine)
    const rowOpenedCount = getOpenedCount(rowLine)
    const diagonalOpenedCount = getOpenedCount(diagonalLine)
    const diagonalLBRTOpenedCount = getOpenedCount(diagonalLBRTLine)

    let maxOpenedCount = 0
    maxOpenedCount =
      colOpenedCount > maxOpenedCount ? colOpenedCount : maxOpenedCount
    maxOpenedCount =
      rowOpenedCount > maxOpenedCount ? rowOpenedCount : maxOpenedCount
    maxOpenedCount =
      diagonalOpenedCount > maxOpenedCount
        ? diagonalOpenedCount
        : maxOpenedCount
    maxOpenedCount =
      diagonalLBRTOpenedCount > maxOpenedCount
        ? diagonalLBRTOpenedCount
        : maxOpenedCount

    if (maxOpenedCount == 4) {
      generalStateModule.setToastMessage('!!!!!BINGO!!!!!')
    } else if (maxOpenedCount === 3) {
      generalStateModule.setToastMessage('リーチ!')
    }
  }
}
