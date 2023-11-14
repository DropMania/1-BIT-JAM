export default class Settings extends Phaser.Scene {
	constructor(game) {
		super()
		this.game = game
		Phaser.Scene.call(this, { key: 'Settings' })
	}
	init({ scene }) {
		this.prevScene = scene
	}
	preload() {}
	create() {
		
		this.params = new URLSearchParams(window.location.search)
		this.cursor = 0
		this.add.rectangle(0, 0, 1280, 720, 0x000000, 0.8).setOrigin(0, 0)
		this.add
			.text(140, 100, 'Settings', {
				fontSize: '48px',
				fill: '#fff',
				fontFamily: 'manaspc',
			})
			.setOrigin(0, 0.5)
			.setResolution(5)
		this.controlImg = this.add.image(700, 300, 'controls').setVisible(false).setScale(3)
		this.volExplatnation = this.add
			.text(700, 300, 'Press <- and -> to adjust volume', {
				fill: '#fff',
				fontSize: '24px',
				fontFamily: 'manaspc',
			})
			.setOrigin(0, 0.5)
			.setResolution(5)
			.setVisible(false)

		if(localStorage.getItem('volume') === null){
			this.vol = Math.round(this.sound.volume * 10).toFixed(0)
		}else{
			this.vol = Number(localStorage.getItem('volume')).toFixed(0);
		}
		this.options = ['Resume', `Volume - ${this.vol}`, 'Controls']

		this.menuOptions = this.add.group()
		this.options.forEach((option, i) => {
			this.menuOptions.add(
				this.add
					.text(100, 250 + i * 50, option, {
						fontSize: '32px',
						fill: '#fff',
						fontFamily: 'manaspc',
					})
					.setOrigin(0, 0.5)
					.setResolution(5)
			)
		})
		this.keys = this.input.keyboard.addKeys({
			space: Phaser.Input.Keyboard.KeyCodes.SPACE,
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			esc: Phaser.Input.Keyboard.KeyCodes.ESC,
			enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
		})
		this.pads = this.input.gamepad
		this.showCursor()
		this.keys.space.on('down', this.select, this)
		this.keys.enter.on('down', this.select, this)
		this.keys.left.on('down', this.left, this)
		this.keys.right.on('down', this.right, this)
		this.keys.up.on('down', this.up, this)
		this.keys.down.on('down', this.down, this)
		this.keys.esc.on('down', this.resume, this)
		this.time.addEvent({
			delay: 1,
			callback: () => {
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
					if (btn.index === 9) {
						this.resume()
					}
				})
			},
		})
	}
	select() {
		switch (this.options[this.cursor]) {
			case 'Resume':
				// this.sound.play('menu')
				this.resume()
				break
		}
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
	left() {
		if (this.cursor === 1) {
			this.vol--
			if (this.vol < 0) this.vol = 0
			this.options[1] = `Volume - ${this.vol}`
			this.showCursor()
			this.sound.volume = (this.vol / 10).toFixed(1)
			localStorage.setItem('volume', this.vol)
		}
	}
	right() {
		if (this.cursor === 1) {
			this.vol++
			if (this.vol > 10) this.vol = 10
			this.options[1] = `Volume - ${this.vol}`
			this.showCursor()
			this.sound.volume = (this.vol / 10).toFixed(1)
			console.log(this.sound.volume);
			localStorage.setItem('volume', this.vol)
		}
	}
	showCursor() {
		this.menuOptions.getChildren().forEach((option, index) => {
			if (index === this.cursor) {
				option.text = '> ' + this.options[index] + ' <'
				if (index === 1) {
					this.volExplatnation.setVisible(true)
				}
				if (index === 2) {
					this.controlImg.setVisible(true)
				}
			} else {
				option.text = '  ' + this.options[index]
				this.controlImg.setVisible(false)
				this.volExplatnation.setVisible(false)
			}
		})
	}

	update() {}
	resume() {
		this.scene.resume(this.prevScene)
		this.scene.stop()
	}
}
