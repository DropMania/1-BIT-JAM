import Player from '../sprites/Player.js'
import { createEnemie } from '../sprites/EnemiesFactory.js'

export default class Level extends Phaser.Scene {
	constructor(game) {
		super({ key: 'Level' })

		this.game = game
	}
	init({ level }) {
		this.level = level
	}
	preload() {}
	create() {
		this.registry.set('player_health', 3)
		if (!this.scene.get('UI').scene.isVisible()) {
			this.scene.get('UI').scene.setVisible(true, 'UI')
		}

		this.raycaster = this.raycasterPlugin.createRaycaster({
			debug: true,
		})
		this.keys = this.input.keyboard.addKeys({
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
			dash: Phaser.Input.Keyboard.KeyCodes.K,
			esc: Phaser.Input.Keyboard.KeyCodes.ESC,
		})
		this.finished = false
		this.pads = this.input.gamepad
		this.map = this.make.tilemap({ key: `level_${this.level}` })
		this.peds = this.add.group()
		this.tileset = this.map.addTilesetImage('tileset', 'tileset')
		this.collisionLayer = this.map.createLayer('Collision', this.tileset, 0, 0)
		this.specialColls = this.add.group()
		this.deathTiles = this.add.group()
		this.collisionLayer.setCollision([241])
		this.collisionLayer.forEachTile((tile) => {
			if (tile.index === 242) {
				let col = this.add.rectangle(tile.pixelX, tile.pixelY + 8, 16, 8).setOrigin(0, 0)
				this.physics.add.existing(col)
				col.body.setImmovable(true)
				this.specialColls.add(col)
			}
			if (tile.index === 243) {
				let col = this.add.rectangle(tile.pixelX, tile.pixelY, 16, 16).setOrigin(0, 0)
				this.physics.add.existing(col)
				col.body.setImmovable(true)
				this.deathTiles.add(col)
			}
		})
		this.collisionLayer.visible = false
		this.backgroundLayer = this.map.createLayer('Background', this.tileset, 0, 0)
		this.backgroundLayer.alpha = 0.5
		this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0)
		this.objectLayer = this.map.getObjectLayer('Objects')
		this.objectLayer.objects.forEach((object) => {
			let props = {}
			if (object.properties) {
				object.properties.forEach((property) => {
					props[property.name] = property.value
				})
			}
			// console.log(object)
			if (object.name === 'Spawn') {
				this.player = new Player(this, object.x, object.y).setDepth(10)
			} else if (object.name === 'Tree') {
				this.tree = this.add.image(object.x, object.y, 'Tree').setOrigin(0, 0.6)
				this.physics.add.existing(this.tree)
			} else if (object.name === 'Image') {
				this.add.image(object.x, object.y, props.src)
			} else if (object.name === 'Enemie') {
				this.peds.add(createEnemie(this, props.type, object.x, object.y, props))
			}
		})

		this.physics.add.collider(this.player, this.collisionLayer)
		this.physics.add.collider(this.player, this.specialColls)
		this.physics.add.collider(this.player, this.deathTiles, () => {
			this.gameOver()
		})
		this.physics.add.overlap(this.player, this.tree, (player, tree) => {
			this.finish(tree)
		})

		this.physics.add.collider(this.peds, this.collisionLayer)
		this.physics.add.collider(this.peds, this.specialColls)

		this.cameras.main.centerOn(this.player.x, this.player.y)
		this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
		this.cameras.main.setZoom(3)

		/* this.snow = this.add.particles(0, 0, 'Snow', {
			frame: [0, 1, 2, 3, 4],
			x: { min: 0, max: this.map.widthInPixels },
			blendMode: 'ADD',
			scale: { start: 0.5, end: 0 },
			gravityY: 50,
			lifespan: 3000,
			quantity: 7,
			speed: { min: 10, max: 50 },
		}) 
		this.snow.setDepth(-10)
		*/
		this.updateRaycaster()
	}
	finish(tree) {
		if (this.finished) return
		this.finished = true
		let state = this.registry.get('state')
		console.log(this.level, state.levelsDone)
		if (!state.levelsDone.includes(this.level) && this.level != 'begin') {
			this.player.sackSize += 1
			state.sackSize = this.player.sackSize
			state.levelsDone.push(this.level)
			this.registry.set('state', state)
		}
		this.add.image(tree.x, tree.y, 'Presents').setOrigin(0, 0.6)
		this.player.stop('Finish')
		let fanfare = this.sound.add('fanfare')
		fanfare.play()
		fanfare.once('complete', () => {
			this.fadeOut('Finish')
		})
	}
	gameOver() {
		if (this.finished) return
		this.finished = true
		this.player.stop('GameOver')
		let gameOver = this.sound.add('gameOver')
		gameOver.play()
		gameOver.once('complete', () => {
			this.fadeOut()
		})
	}
	fadeOut(type) {
		let state = this.registry.get('state')
		this.cameras.main.fadeOut(300, 0, 0, 0, (camera, progress) => {
			if (progress === 1) {
				if (type == 'Finish' && state.levelsDone.length >= 6) this.scene.start('Story', { id: 'end' })
				else this.scene.start('World', { level: this.level })
			}
		})
	}
	update() {
		this.player.update()
		if (this.player.y > this.map.heightInPixels + 16) {
			this.gameOver()
		}
		this.peds.children.each((ped) => {
			ped.update()
		})
	}

	updateRaycaster() {
		this.raycaster.mapGameObjects([this.player], true)
	}
}
