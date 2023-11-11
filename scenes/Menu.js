export default class Menu extends Phaser.Scene {
	constructor(game) {
		super()
		this.game = game
		Phaser.Scene.call(this, { key: 'Menu' })
	}
	init({}) {}
	preload() {}
	create() {
		// console.log(this.UrlParams.get('lvl'))
		this.add
			.text(500, 100, this.registry.get('game_title'), {
				fill: '#fff',
				fontSize: '25px',
				fontFamily: 'manaspc',
			})
			.setOrigin(0.5, 0.5)
			.setResolution(5)

		this.menuOptions = this.add.group()
		this.cursor = 0
		this.options = [
			{
				text: 'Play',
				action: () => {
					this.registry.set('state', {
						sackSize: 0,
						levelsDone: [],
					})
					//this.scene.start('Level', { level: 0 })
					this.scene.start('World')
				},
			},
			{
				text: 'Settings',
				action: () => {
					this.scene.launch('Settings', { scene: this })
					this.scene.pause()
				},
			},
			{
				text: 'Credits',
				action: () => {
					this.scene.start('Credits', { scene: 'Menu' })
				},
			},
		]

		this.options.forEach((option, index) => {
			this.menuOptions.add(
				this.add
					.text(500, 200 + index * 50, option.text, {
						fill: '#fff',
						fontSize: '24px',
						fontFamily: 'manaspc',
					})
					.setOrigin(0, 0.5)
					.setResolution(5)
			)
		})

		this.showCursor()

		this.keys = this.input.keyboard.addKeys({
			space: Phaser.Input.Keyboard.KeyCodes.SPACE,
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		})
		this.pads = this.input.gamepad
		this.keys.space.on('down', this.select, this)
		this.keys.enter.on('down', this.select, this)
		this.keys.up.on('down', this.up, this)
		this.keys.down.on('down', this.down, this)
		this.keys.left.on('down', this.left, this)
		this.keys.right.on('down', this.right, this)
		this.pads.on('down', (pad, btn) => {
			if (btn.index === 0) {
				this.select()
			}
			if (btn.index === 12) {
				this.up()
			}
			if (btn.index === 13) {
				this.down()
			}
			if (btn.index === 14) {
				this.left()
			}
			if (btn.index === 15) {
				this.right()
			}
		})
	}

	update(time, delta) {}

	select() {
		// this.sound.play('menu')
		this.options[this.cursor].action()
	}
	up() {
		this.cursor--
		if (this.cursor < 0) {
			this.cursor = this.menuOptions.getChildren().length - 1
		}
		this.showCursor()
		// this.sound.play('menu')
	}
	down() {
		this.cursor++
		if (this.cursor > this.menuOptions.getChildren().length - 1) {
			this.cursor = 0
		}
		this.showCursor()
		// this.sound.play('menu')
	}
	left() {}
	right() {}
	showCursor() {
		this.menuOptions.getChildren().forEach((option, index) => {
			if (index === this.cursor) {
				option.text = '> ' + this.options[index].text + ' <'
				// this.explanation.text = this.options[index].explanation
			} else {
				option.text = '  ' + this.options[index].text
			}
		})
	}
}
