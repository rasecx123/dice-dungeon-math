import Phaser from 'phaser'
import { GameScene } from './GameScene'
import './style.css'

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#1a1a1a',
    parent: 'game-container',
    scene: [GameScene]
}

new Phaser.Game(config)