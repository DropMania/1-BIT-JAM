import Level from './Level.js'
import Grinch from '../sprites/enemies/Grinch.js'
export default class GrinchBoss extends Level {
	constructor(game) {
		super(game, 'GrinchBoss')

		this.game = game
	}

	create() {
		super.create()
		console.log(this)
		this.platforms = this.add.group()
		//create 3 platforms in a circle 50px away from this.map.widthInPixels / 2, this.map.heightInPixels / 2
		for (let i = 0; i < 4; i++) {
			let platform = this.add.image(
				this.map.widthInPixels / 2 + Math.cos((i * Math.PI) / 2) * 130,
				this.map.heightInPixels / 2 + Math.sin((i * Math.PI) / 2) * 130,
				'Platform'
			)
			this.physics.add.existing(platform)
			platform.body.setImmovable(true)
			this.platforms.add(platform)
		}
		this.physics.add.collider(this.platforms, this.player, (obj1, player) => {
			player.lastTouchedPlatform = true
		})
		this.cameras.main.setZoom(3)

		this.grinch = new Grinch(this, this.map.widthInPixels / 2, this.map.heightInPixels / 2)
		this.physics.add.collider(this.switches, this.player, (sw, player) => {
			if (sw.pressed) return
			this.sound.play('hit')
			sw.setFrame(1)
			sw.body.setSize(16, 1)
			sw.body.setOffset(0, 15)
			sw.pressed = true
			if (this.switches.getChildren().every((sw) => sw.pressed)) {
				this.pressedAllSwitches = true
			}
			if (this.pressedAllSwitches) {
				this.end()
			}
		})
		this.ended = false
		this.pressedAllSwitches = false
	}
	end() {
		if (this.ended) return
		this.player.stop()
		this.ended = true
		this.sound.stopAll()
		this.sound.play('fanfare')
		this.cameras.main.stopFollow()
		this.cameras.main.zoomTo(2, 1000)
		this.cameras.main.pan(this.grinch.x, this.grinch.y, 1000, 'Sine.easeInOut', true)
		this.grinch.dead = true
		this.grinch.grinchTween.stop()
		this.time.delayedCall(3000, () => {
			this.grinch.setGravityY(300)
		})
		this.time.delayedCall(5000, () => {
			this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
				if (progress == 1) this.scene.start('Story', { id: 'end' })
			})
		})
	}
	update() {
		super.update()
		//move platforms in circle without rotating them space them out evenly
		let i = 0
		this.platforms.children.iterate((platform) => {
			platform.x = this.map.widthInPixels / 2 + Math.cos((i * Math.PI) / 2 + this.time.now / 2000) * 130
			platform.y = this.map.heightInPixels / 2 + Math.sin((i * Math.PI) / 2 + this.time.now / 2000) * 130
			i++
		})

		this.grinch.update()
	}
}
