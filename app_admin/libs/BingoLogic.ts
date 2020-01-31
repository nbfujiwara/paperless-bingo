import { IEntry } from '../../common/interfaces/IEntry'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'
import AppUtil from '~/libs/AppUtil'

export default class BingoLogic {
  public static GAME_ID: string = '1'
  public static SHEET_STATUS_BINGO: number = 3
  public static SHEET_STATUS_REACH: number = 2
  public static SHEET_STATUS_NORMAL: number = 1
  public static SHEET_STATUS_UNKNOWN: number = 0
  private static lineList: { row: number; col: number; idx: number }[][] = []

  public static loadGame() {
    return AppUtil.FBMng.getGame(this.GAME_ID).then((game) => {
      if (game) {
        basicStateModule.setGame(game)
      } else {
        return AppUtil.FBMng.saveGame(this.GAME_ID, basicStateModule.game).then(
          () => {
            generalStateModule.setToastMessage('初期化ゲーム情報を保存しました')
          }
        )
      }
    })
  }
  public static resetGame() {
    const game = { hits: [], started: false }
    basicStateModule.setGame(game)
    AppUtil.FBMng.saveGame(this.GAME_ID, game).then(() => {
      generalStateModule.setToastMessage('ゲームをリセットしました')
    })
  }
  public static startGame() {
    const game = basicStateModule.game
    game.started = true
    AppUtil.FBMng.saveGame(this.GAME_ID, game)
      .then(() => {
        return this.loadGame()
      })
      .then(() => {
        generalStateModule.setToastMessage('エントリーを締め切りました')
      })
  }

  public static drawNumber(num: number) {
    basicStateModule.pushHit(num)
    return AppUtil.FBMng.savePushGameHit(this.GAME_ID, num).then(() => {
      generalStateModule.setToastMessage(num + 'を追加しました')
    })
  }
  public static drawRandomNumber() {
    const remainList = []
    for (let num = 1; num <= 75; num++) {
      if (!basicStateModule.game.hits.includes(num)) {
        remainList.push(num)
      }
    }
    const randIdx = Math.floor(Math.random() * remainList.length)
    const hitNum = remainList[randIdx]
    basicStateModule.pushHit(hitNum)
    return AppUtil.FBMng.savePushGameHit(this.GAME_ID, hitNum).then(() => {
      return hitNum
    })
  }

  public static loadEntries() {
    return AppUtil.FBMng.getEntries().then((list: IEntry[]) => {
      basicStateModule.setEntries(list)
      generalStateModule.setToastMessage(
        'エントリーロード(' + list.length + '件' + ')'
      )
    })
  }

  /**
   * BINGOに判定するラインを定義
   */
  private static getLineList(): { row: number; col: number; idx: number }[][] {
    if (this.lineList.length) {
      // 不変なので何度も算出する必要なし
      return this.lineList
    }
    const cellObj = (
      row: number,
      col: number
    ): { row: number; col: number; idx: number } => {
      return { row, col, idx: row + col * 5 }
    }

    const lines: { row: number; col: number; idx: number }[][] = []
    // 縦と横
    for (let i = 0; i < 5; i++) {
      lines[i] = []
      lines[i + 5] = []
      for (let j = 0; j < 5; j++) {
        lines[i].push(cellObj(i, j))
        lines[i + 5].push(cellObj(j, i))
      }
    }
    // 斜め
    lines[10] = []
    lines[11] = []
    for (let i = 0; i < 5; i++) {
      lines[10].push(cellObj(i, i))
      lines[11].push(cellObj(i, 4 - i))
    }
    this.lineList = lines
    return lines
  }

  public static getSheetStatus(sheet: number[], hits: number[]) {
    if (sheet.length !== 25) {
      return this.SHEET_STATUS_UNKNOWN
    }
    let status = this.SHEET_STATUS_NORMAL
    const lines = this.getLineList()
    for (const line of lines) {
      let counter: number = 0
      for (const cell of line) {
        if (cell.col === 2 && cell.row === 2) {
          counter++
        } else {
          const num = sheet[cell.idx]
          if (hits.includes(num)) {
            counter++
          }
        }
      }
      if (counter === 5) {
        return this.SHEET_STATUS_BINGO
      } else if (counter === 4) {
        status = this.SHEET_STATUS_REACH
      }
    }
    return status
  }
  public static getSheetStatusName(sheetStatus: number): string {
    switch (sheetStatus) {
      case this.SHEET_STATUS_BINGO:
        return 'ビンゴ'
      case this.SHEET_STATUS_REACH:
        return 'リーチ'
      case this.SHEET_STATUS_NORMAL:
        return '通常'
    }
    return '不明'
  }
}
