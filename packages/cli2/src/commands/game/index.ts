import {Command, Flags} from '@oclif/core'
import {GameEngine} from '@pnpm-template/lib'
import * as readline from 'node:readline'

export default class Game extends Command {
  static description = 'Play a game of Tic-Tac-Toe'
  static examples = ['$ t3 game --mode human-vs-human', '$ t3 game --mode human-vs-ai', '$ t3 game --mode ai-vs-ai']
  static flags = {
    help: Flags.help({char: 'h'}),
    mode: Flags.string({
      char: 'm',
      default: 'human-vs-ai',
      description: 'Game mode',
      options: ['human-vs-human', 'human-vs-ai', 'ai-vs-ai'],
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Game)

    this.log('🎮 Welcome to Tic-Tac-Toe!')
    this.log('')

    let gameEngine: GameEngine

    switch (flags.mode) {
      case 'ai-vs-ai': {
        gameEngine = GameEngine.createRandomAIVsStrategicAI()
        break
      }

      case 'human-vs-ai': {
        gameEngine = GameEngine.createHumanVsRandomAI()
        break
      }

      case 'human-vs-human': {
        gameEngine = GameEngine.createHumanVsHuman()
        break
      }

      default: {
        gameEngine = GameEngine.createHumanVsRandomAI()
      }
    }

    await this.playGame(gameEngine, flags.mode!)
  }

  private displayBoard(board: (null | string)[][]): void {
    this.log('   A   B   C')
    this.log('  ┌───┬───┬───┐')

    for (let row = 0; row < 3; row++) {
      let rowStr = `${row + 1} │`
      for (let col = 0; col < 3; col++) {
        const cell = board[row][col]
        const display = cell || ' '
        rowStr += ` ${display} │`
      }

      this.log(rowStr)

      if (row < 2) {
        this.log('  ├───┼───┼───┤')
      }
    }

    this.log('  └───┴───┴───┘')
  }

  private async handleHumanMove(gameEngine: GameEngine): Promise<void> {
    const state = gameEngine.getGameState()
    const availableMoves = gameEngine.getAvailableMoves()

    this.log(`Your turn (${state.currentPlayer})!`)
    this.log('Available moves:')
    for (const move of availableMoves) {
      const gridPos = {letter: String.fromCodePoint(65 + move.col), number: move.row + 1}
      this.log(`  ${gridPos.letter}${gridPos.number}`)
    }

    // Get user input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const question = (prompt: string): Promise<string> =>
      new Promise((resolve) => {
        rl.question(prompt, (answer) => {
          resolve(answer.trim().toUpperCase())
        })
      })

    let validMove = false
    let move: null | {col: number; row: number} = null
    let input = ''

    // Only one await per loop iteration
    while (!validMove) {
      input = await question('Enter your move (e.g., A1, B2, C3): ')

      // Parse the input (e.g., "A1" -> row=0, col=0)
      if (input.length === 2) {
        const letter = input[0]
        const number = Number.parseInt(input[1], 10)

        if (letter >= 'A' && letter <= 'C' && number >= 1 && number <= 3) {
          const col = letter.codePointAt(0)! - 65 // A=0, B=1, C=2
          const row = number - 1 // 1=0, 2=1, 3=2

          // Check if this move is available
          const isAvailable = availableMoves.some((m) => m.row === row && m.col === col)

          if (isAvailable) {
            move = {col, row}
            validMove = true
          } else {
            this.log('❌ That position is already taken. Try again.')
          }
        } else {
          this.log('❌ Invalid input. Use format like A1, B2, C3.')
        }
      } else {
        this.log('❌ Invalid input. Use format like A1, B2, C3.')
      }
    }

    rl.close()

    if (move) {
      gameEngine.makeMoveAt(move)
      this.log(`✅ Made move at ${String.fromCodePoint(65 + move.col)}${move.row + 1}`)
    }
  }

  private async playGame(gameEngine: GameEngine, mode: string): Promise<void> {
    while (!gameEngine.isGameOver()) {
      const state = gameEngine.getGameState()
      this.displayBoard(state.board)
      this.log('')

      if (mode === 'human-vs-human' || (mode === 'human-vs-ai' && state.currentPlayer === 'X')) {
        // Human player's turn

        await this.handleHumanMove(gameEngine)
      } else {
        // AI player's turn
        this.log(`🤖 AI (${state.currentPlayer}) is thinking...`)

        await gameEngine.makeMove()
      }
    }

    // Game over
    const finalState = gameEngine.getGameState()
    this.displayBoard(finalState.board)
    this.log('')

    const winner = gameEngine.getWinner()
    if (winner) {
      this.log(`🎉 ${winner} wins!`)
    } else {
      this.log("🤝 It's a tie!")
    }
  }
}
