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
		this.raycaster = this.raycasterPlugin.createRaycaster({
			//debug: true,
		})
		this.keys = this.input.keyboard.addKeys({
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
			esc: Phaser.Input.Keyboard.KeyCodes.ESC,
		})
		this.pads = this.input.gamepad
		this.map = this.make.tilemap({ key: `level_${this.level}` })
		this.tileset = this.map.addTilesetImage('tileset', 'tileset')
		this.collisionLayer = this.map.createLayer('Collision', this.tileset, 0, 0)
		this.collisionLayer.setCollisionByProperty({ collides: true })
		this.backgroundLayer = this.map.createLayer('Background', this.tileset, 0, 0)
		this.backgroundLayer.forEachTile((tile) => {
			tile.tint = 0x666666
		})
		this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0)
		this.objectLayer = this.map.getObjectLayer('Objects')
		this.objectLayer.objects.forEach((object) => {
			if (object.name === 'Spawn') {
				this.player = new Player(this, object.x, object.y)
			}
		})
		this.physics.add.collider(this.player, this.collisionLayer)
		this.cameras.main.centerOn(this.player.x, this.player.y)
		this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
		this.cameras.main.setZoom(3)

		this.snow = this.add.particles(0, 0, 'Snow', {
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

		this.peds = this.add.group()

		this.peds.add(createEnemie(this, 'dog', 260, 195, {}))
		// this.test =
	}
	update() {
		this.player.update()
		// this.test.update()
		this.peds.children.each((ped) => {
			ped.update()
		})
	}
}
