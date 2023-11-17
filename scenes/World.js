import Sleigh from '../sprites/Sleigh.js'
export default class World extends Phaser.Scene {
	constructor(game) {
		super({ key: 'World' })

		this.game = game
	}
	init({ level }) {
		this.level = level
	}
	preload() {}
	create() {
		if (this.scene.get('UI').scene.isVisible()) {
			this.scene.get('UI').scene.setVisible(false, 'UI')
		}
		this.keys = this.input.keyboard.addKeys({
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			esc: Phaser.Input.Keyboard.KeyCodes.ESC,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE,
		})
		this.song = this.sound.add('overworld', { loop: true, volume: 0.5 })
		this.song.play()
		this.pads = this.input.gamepad
		this.onLevel = false
		this.currentEntrance = 0
		this.map = this.make.tilemap({ key: 'world' })
		this.tileset = this.map.addTilesetImage('tileset', 'tileset')
		this.collisionLayer = this.map.createLayer('Collision', this.tileset, 0, 0)
		this.collisionLayer.setCollision([241, 242])
		this.background = this.add.image(0, 0, 'world').setOrigin(0, 0)
		this.objectLayer = this.map.getObjectLayer('Objects')
		this.entrances = this.add.group()
		let state = this.registry.get('state')
		this.objectLayer.objects.forEach((object) => {
			let properties = {}
			if (object.properties) {
				object.properties.forEach((property) => {
					properties[property.name] = property.value
				})
			}
			if (object.name === 'Spawn') {
				this.sleigh = new Sleigh(this, object.x, object.y)
			}
			if (object.name === 'Level') {
				let entrance = this.add.rectangle(object.x, object.y, 16, 30)
				entrance.level = properties.level
				this.physics.add.existing(entrance)
				this.entrances.add(entrance)
				if (state.levelsDone.includes(properties.level)) {
					this.add.image(object.x, object.y, 'Check')
				}
			}
			if (object.name === 'Block') {
				if (state.levelsDone.length < 3) {
					this.block = this.add.image(object.x, object.y, 'Block').setOrigin(0, 0)
					this.physics.add.existing(this.block)
					this.block.body.setImmovable(true)
				}
			}
		})
		if (state.levelsDone.length >= 6) {
			let grinch = this.add.image(437, 160, 'GrinchWorld')
			this.tweens.add({
				targets: grinch,
				y: 150,
				duration: 1000,
				ease: 'Sine.easeInOut',
				repeat: -1,
				yoyo: true,
			})
			grinch.level = 'grinch'
			this.physics.add.existing(grinch)
			this.entrances.add(grinch)
		}
		if (this.level) {
			let level = this.objectLayer.objects.find((object) => {
				return (
					object.name === 'Level' &&
					object.properties.find((property) => property.name === 'level' && property.value === this.level)
				)
			})
			if (level) {
				this.sleigh.x = level.x
				this.sleigh.y = level.y
			}
		}
		this.physics.add.collider(this.sleigh, this.collisionLayer)
		this.physics.add.collider(this.sleigh, this.block)
		this.cameras.main.setBounds(0, 0, this.background.width, this.background.height)
		this.cameras.main.setZoom(3)
		this.cameras.main.startFollow(this.sleigh, true, 0.1, 0.1)
		this.snow = this.add.particles(0, 0, 'Snow', {
			frame: [0, 1, 2, 3, 4],
			x: { min: 0, max: this.map.widthInPixels },
			blendMode: 'ADD',
			scale: { start: 0.5, end: 0 },
			gravityY: 20,
			lifespan: 3000,
			quantity: 2,
			speed: { min: 10, max: 50 },
		})

		this.enterText = this.add
			.text(0, 0, 'ENTER', {
				fontSize: '8px',
				fill: '#fff',
				fontFamily: 'manaspc',
				stroke: '#000',
				strokeThickness: 2,
			})
			.setOrigin(0.5, 0.5)
			.setResolution(5)
			.setVisible(false)
		this.keys.space.on('down', () => {
			this.enterLevel()
		})
		this.pads.on('down', (pad, btn) => {
			if (btn.index === 0) {
				this.enterLevel()
			}
		})
	}
	enterLevel() {
		if (!this.onLevel) return
		this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
			if (progress === 1) {
				this.song.stop()
				this.scene.start('Level', { level: this.currentEntrance.level })
			}
		})
	}
	update() {
		this.snow.y = this.cameras.main.scrollY + 200
		this.sleigh.update()
		this.onLevel = this.physics.overlap(this.sleigh, this.entrances, (sleigh, entrance) => {
			this.currentEntrance = entrance
		})
		if (this.onLevel) {
			this.enterText.setVisible(true)
			this.enterText.x = this.currentEntrance.x
			this.enterText.y = this.currentEntrance.y + 24
		} else {
			this.enterText.setVisible(false)
		}
	}
}
