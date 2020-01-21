import { bingoStateModule } from '~/store/modules/bingo'
import { generalStateModule } from '~/store/modules/general'
import AppUtil from '~/libs/AppUtil'

export default class BingoLogic {
  static GAME_ID: string = '1'
  public static resetGame() {
    const game = { hits: [], started: false }
    bingoStateModule.setGame(game)
    AppUtil.FBMng.saveGame(BingoLogic.GAME_ID, game).then(() => {
      generalStateModule.setToastMessage('ゲームをリセットしました')
    })
  }
  public static startGame() {
    bingoStateModule.startGame()

  }

  public static drawNumber(num: number) {
    bingoStateModule.pushHit(num)
    return AppUtil.FBMng.saveGame(
      BingoLogic.GAME_ID,
      bingoStateModule.game
    ).then(() => {
      generalStateModule.setToastMessage(num + 'を追加しました')
    })
  }
}
