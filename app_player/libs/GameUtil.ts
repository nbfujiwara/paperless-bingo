import { IBingoCell } from '../../common/interfaces/IBingoCell'
import { IUser } from '~/../common/interfaces/IUser'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'
import AppUtil from '~/libs/AppUtil'
import BingoLogic from '~/libs/BingoLogic'
import { IGame } from '~/../common/interfaces/IGame'

export default class GameUtil {
  public static entry(user: IUser) {
    const sheet = BingoLogic.createRandomBingoSheet()
    const entry = { user, sheet }

    return AppUtil.FBMng.getGame(BingoLogic.GAME_ID).then((game: IGame) => {
      if (game) {
        if (game.started) {
          generalStateModule.setToastMessage(
            '抽選を開始してしまったので、もう参加できません'
          )
          return false
        } else {
          return AppUtil.FBMng.saveEntry(entry).then(() => {
            generalStateModule.setIsRegistered(true)
            basicStateModule.setSheet(sheet)
            generalStateModule.setToastMessage('参加しました')
            return true
          })
        }
      }
      generalStateModule.setToastMessage('想定外エラー')
      return false
    })
  }
  public static resetSheet() {
    const sheet = BingoLogic.createRandomBingoSheet()
    AppUtil.FBMng.saveEntrySheet(sheet)
      .then(() => {
        basicStateModule.setSheet(sheet)
      })
      .then(() => {
        generalStateModule.setToastMessage('変えました！')
      })
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
            this.handlingAddedHitNum(newHits[i])
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
      switch (
        BingoLogic.getSheetBingoStatus(row, col, basicStateModule.sheetCells)
      ) {
        case BingoLogic.SHEET_STATUS_BINGO:
          generalStateModule.setToastMessage('!!!!!BINGO!!!!!')
          break
        case BingoLogic.SHEET_STATUS_REACH:
          generalStateModule.setToastMessage('リーチ!')
          break
      }
    }
  }
}
