import { IBingoCell } from '../../common/interfaces/IBingoCell'
import { IGame } from '~/../common/interfaces/IGame'

export default class BingoLogic {
  static GAME_ID: string = '1'
  public static SHEET_STATUS_BINGO: number = 3
  public static SHEET_STATUS_REACH: number = 2
  public static SHEET_STATUS_NORMAL: number = 1
  public static SHEET_STATUS_UNKNOWN: number = 0

  public static createRandomBingoSheet(): number[] {
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
  public static sheetArrayToSheetCellsData(numArray: number[]): IBingoCell[][] {
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
    return sheetCells
  }

  public static getSheetBingoStatus(
    targetRow: number,
    targetCol: number,
    sheetCells: IBingoCell[][]
  ) {
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
        if (sheetCells[pos.row][pos.col].opened) {
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

    if (maxOpenedCount === 4) {
      return this.SHEET_STATUS_BINGO
    } else if (maxOpenedCount === 3) {
      return this.SHEET_STATUS_REACH
    }
    return this.SHEET_STATUS_NORMAL
  }
}
