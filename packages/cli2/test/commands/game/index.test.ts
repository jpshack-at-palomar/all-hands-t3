import {expect} from 'chai'
import {exec} from 'node:child_process'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {promisify} from 'node:util'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const execAsync = promisify(exec)

describe('game', () => {
  it('runs game --help', async () => {
    const binPath = path.join(__dirname, '../../../bin/run.js')
    const {stdout} = await execAsync(`node ${binPath} game --help`)
    expect(stdout).to.contain('Play a game of Tic-Tac-Toe')
  })

  it('runs ai vs ai game', async () => {
    const binPath = path.join(__dirname, '../../../bin/run.js')
    const {stdout} = await execAsync(`node ${binPath} game --mode ai-vs-ai`)
    expect(stdout).to.contain('🎮 Welcome to Tic-Tac-Toe!')
    expect(stdout).to.contain('🤖 AI')
    expect(stdout).to.match(/🎉 .* wins!|🤝 It's a tie!/)
  })
})
