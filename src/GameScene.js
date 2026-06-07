import Phaser from 'phaser'

export class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('GameScene')
    }

    preload()
    {
        this.load.image(
            'background',
            'background.png'
        )

        this.load.image(
            'knight',
            'knight.png'
        )

        this.load.image(
            'boss',
            'boss.png'
        )

        this.load.image(
            'title',
            'title.png'
        )
    }

    create()
    {
        this.add.image(
            640,
            360,
            'background'
        ).setDepth(-1)

        this.titleImage = this.add.image(
            650,
            145,
            'title'
        )

        this.titleImage.setScale(0.7)

        this.knightSprite = this.add.image(
            250,
            500,
            'knight'
        )

        this.knightSprite.setScale(0.4)

        this.bossSprite = this.add.image(
            1000,
            500,
            'boss'
        )

        this.bossSprite.setScale(0.55)

        this.playerHP = 100
        this.bossHP = 300
        this.maxPlayerHP = 100
        this.maxBossHP = 300
        this.gameOver = false

        document.getElementById('restart-button').style.display = 'none'
                
        document.getElementById('attack-button').disabled = false
        document.getElementById('answer-input').disabled = false
        document.getElementById('answer-input').value = ''

        this.playerBarBg = this.add.rectangle(
            180,
            170,
            250,
            25,
            0x444444
        )

        this.playerBar = this.add.rectangle(
            180,
            170,
            250,
            25,
            0x00ff00
        )

        this.bossBarBg = this.add.rectangle(
            1100,
            170,
            250,
            25,
            0x444444
        )

        this.bossBar = this.add.rectangle(
            1100,
            170,
            250,
            25,
            0xff0000
        )

        this.playerText = this.add.text(
            60,
            210,
            `${this.playerHP} / ${this.maxPlayerHP}`,
            { fontSize: '24px' }
        )

        this.bossText = this.add.text(
            980,
            210,
            `${this.bossHP} / ${this.maxBossHP}`,
            { fontSize: '24px' }
        )

        /*this.titleText = this.add.text(
            640,
            50,
            'Dice Dungeon Math',
            { fontSize: '48px' }
        )

        this.titleText.setOrigin(0.5)*/

        this.questionText = this.add.text(
            550,
            450,
            '',
            { fontSize: '28px' }
        )

        this.add.text(60, 120, 'PLAYER')
        this.add.text(980, 120, 'BOSS')

        this.updateHealthBars()

        this.generateQuestion()
        
        this.messageText = this.add.text(
            440,
            500, 
            '',
            { fontSize: '28px'}
        )        

        const attackButton = document.getElementById('attack-button')

        attackButton.onclick = () => {  
            this.attack()
        }

        const input = document.getElementById('answer-input')

        input.onkeydown = (event) =>
        {
            if (event.key === 'Enter')
            {
                this.attack()
            }
        }

        const restartButton = document.getElementById('restart-button')

        restartButton.onclick = () =>
        {
            this.scene.restart()
        }
    }

    generateQuestion()
    {
        this.num1 = Phaser.Math.Between(2, 12)
        this.num2 = Phaser.Math.Between(2, 12)

        this.correctAnswer = this.num1 * this.num2

        this.questionText.setText(
            `${this.num1} x ${this.num2} = ?`
        )
    }

    updateHealthBars()
    {
        const playerPercent =
            this.playerHP / this.maxPlayerHP

        const bossPercent =
            this.bossHP / this.maxBossHP

        this.playerBar.width =
            300 * Math.max(playerPercent, 0)

        this.bossBar.width =
            300 * Math.max(bossPercent, 0)
    }

    attack()
    {

        //console.log("ATTACK")


        if(this.gameOver){
            return
        }

        const input = document.getElementById('answer-input')
        const playerAnswer = parseInt(input.value)

        if (playerAnswer === this.correctAnswer)
        {

            this.tweens.add({
                targets: this.knightSprite,
                x: this.knightSprite.x + 20,
                duration: 100,
                yoyo: true
            })

            this.tweens.add({
                targets: this.bossSprite,
                x: this.bossSprite.x + 15,
                duration: 50,
                yoyo: true
            })

            this.tweens.add({
                targets: this.bossBar,
                x: this.bossBar.x + 5,
                duration: 50,
                yoyo: true,
                repeat: 2
            })

            const diceRoll = Phaser.Math.Between(1, 20)

            let damage = this.correctAnswer + diceRoll

            if (diceRoll === 20)
            {
                damage *= 2

                this.messageText.setText(
                    `💥 Critical Hit! 🎲20 | Damage ${damage}`
                )
            }
            else
            {
                this.messageText.setText(
                    `🎲 Rolled ${diceRoll} | Damage ${damage}`
                )
            }

            this.bossHP -= damage
        }
        else
        {

            this.tweens.add({
                targets: this.knightSprite,
                angle: -10,
                duration: 80,
                yoyo: true
            })

            this.tweens.add({
                targets: this.bossSprite,
                x: this.bossSprite.x - 30,
                duration: 100,
                yoyo: true
            })

            this.tweens.add({
                targets: this.playerBar,
                x: this.playerBar.x - 5,
                duration: 50,
                yoyo: true,
                repeat: 2
            })

            const bossDamage = Phaser.Math.Between(5, 15)

            this.playerHP -= bossDamage

            this.messageText.setText(
                `Wrong! Boss hits for ${bossDamage}`
            )
        }

        this.playerText.setText(
            `${this.playerHP} / ${this.maxPlayerHP}`
        )

        this.bossText.setText(
            `${this.bossHP} / ${this.maxBossHP}`
        )

        this.updateHealthBars()

        input.value = ''

        if (this.bossHP <= 0)
        {
            this.tweens.add({
                targets: this.bossSprite,
                alpha: 0,
                duration: 1000
            })

            this.gameOver = true
            document.getElementById('restart-button').style.display = 'inline-block'

            this.messageText.setText(
                '🏆 VICTORY!'
            )

            document.getElementById('attack-button').disabled = true
            document.getElementById('answer-input').disabled = true
            return
        }

        if (this.playerHP <= 0)
        {
            this.tweens.add({
                targets: this.knightSprite,
                alpha: 0,
                duration: 1000
            })

            this.gameOver = true
            document.getElementById('restart-button').style.display = 'inline-block'

            this.messageText.setText(
                '☠️ GAME OVER!'
            )

            document.getElementById('attack-button').disabled = true
            document.getElementById('answer-input').disabled = true

            return
        }

        this.generateQuestion()
    }
    
}