import {expect} from 'chai'
import {describe, it} from 'mocha'

import Game from '../../../src/commands/game/index.js'

describe('Game Command', () => {
  describe('flag definitions', () => {
    it('should have correct flag definitions', () => {
      expect(Game.flags).to.be.an('object')
      expect(Game.flags.mode).to.be.an('object')
      expect(Game.flags.ai).to.be.an('object')
      expect(Game.flags.ai1).to.be.an('object')
      expect(Game.flags.ai2).to.be.an('object')

      expect(Game.flags.mode.options).to.deep.equal(['human-vs-human', 'human-vs-ai', 'ai-vs-ai'])
      expect(Game.flags.mode.default).to.equal('human-vs-ai')
    })

    it('should have correct examples', () => {
      expect(Game.examples).to.include('$ t3 game --mode human-vs-ai --ai strategic')
      expect(Game.examples).to.include('$ t3 game --mode ai-vs-ai --ai1 random --ai2 strategic')
    })

    it('should have correct descriptions', () => {
      expect(Game.flags.ai.description).to.contain('AI type for human-vs-ai mode')
      expect(Game.flags.ai1.description).to.contain('First AI type for ai-vs-ai mode')
      expect(Game.flags.ai2.description).to.contain('Second AI type for ai-vs-ai mode')
    })
  })

  describe('command properties', () => {
    it('should have correct description', () => {
      expect(Game.description).to.equal('Play a game of Tic-Tac-Toe')
    })

    it('should have help flag', () => {
      expect(Game.flags.help).to.be.an('object')
    })
  })
})
