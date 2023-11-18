export default class Credits extends Phaser.Scene {
	constructor(game) {
		super()
		this.game = game
		Phaser.Scene.call(this, { key: 'Credits' })
	}
	init({ scene }) {
		this.prevScene = scene
	}
	preload() {}
	create() {
		this.sound.stopAll()
		this.song = this.sound.add('overworld', { loop: true, volume: 0.5 })
		this.song.play()
		let credits = [
			[this.registry.get('game_title'), ['1-BIT JAM.', '']],
			['Theme', ['You Start With Everything And End With Nothing', '']],
			['Programming', ['DropMania', 'MrBartagam', '']],
			['Art', ['DropMania', 'MrBartagam', '']],
			['Music', ['DropMania', '']],
			['Sound Effects', ['DropMania', '']],
			['Level Design', ['DropMania', 'MrBartagam', '']],
			['Special Thanks', ['Phaser-Team', 'JavaScript', '1-BIT JAM Team']],
		]
		this.skipText = this.add
			.text(1000, 650, 'Press Space to Continue', {
				fill: '#fff',
				fontSize: '20px',
				fontFamily: 'manaspc',
				align: 'center',
			})
			.setResolution(5)
		this.skipText.setOrigin(0.5, 0.5)
		this.skipText.visible = false
		this.skippable = false
		this.time.addEvent({
			delay: 10000,
			callback: () => {
				this.skipText.visible = true
				this.skippable = true
			},
		})
		this.keys = this.input.keyboard.addKeys({
			space: Phaser.Input.Keyboard.KeyCodes.SPACE,
			esc: Phaser.Input.Keyboard.KeyCodes.ESC,
			enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
		})
		this.pads = this.input.gamepad
		this.keys.space.on('down', this.skip, this)
		this.keys.enter.on('down', this.skip, this)
		this.keys.esc.on('down', this.skip, this)
		this.pads.on('down', (pad, btn) => {
			if (btn.index === 0) {
				this.skip()
			}
			if (btn.index === 9) {
				this.skip()
			}
		})

		this.creditsGroup = this.add.group()
		let index = 0
		credits.forEach((credit, i) => {
			index++
			let title = this.add
				.text(this.game.config.width / 2, 720 + index * 75, `- ${credit[0]} -`, {
					fontSize: '48px',
					fill: '#fff',
					fontFamily: 'manaspc',
				})
				.setOrigin(0.5, 0.5)
				.setResolution(5)
			this.creditsGroup.add(title)
			if (credit.length >= 1) {
				credit[1].forEach((name, j) => {
					index++
					let text = this.add
						.text(this.game.config.width / 2, 720 + index * 75, name, {
							fontSize: '32px',
							fill: '#fff',
							fontFamily: 'manaspc',
						})
						.setOrigin(0.5, 0.5)
						.setResolution(5)
					this.creditsGroup.add(text)
				})
			}
		})
	}

	update() {
		this.creditsGroup.getChildren().forEach((child) => {
			child.y -= 1
		})
		if (this.creditsGroup.getChildren()[this.creditsGroup.getChildren().length - 1].y < -100) {
			this.skip()
		}
	}
	skip() {
		if (!this.skippable) return
		// this.song.stop()
		if (this.prevScene) {
			this.scene.start(this.prevScene)
		} else {
			this.scene.start('World')
		}
	}
}
