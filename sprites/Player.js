export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'Santa')
		/**
		 * @type {Phaser.Scene}
		 */
		this.scene = scene
		this.scene.add.existing(this)
		this.scene.physics.add.existing(this)
		this.body.setCollideWorldBounds(true)
		this.setGravityY(500)
		this.scene.keys.jump.on('down', () => {
			this.jump()
		})
		this.sack = this.scene.add.sprite(this.x - 8, this.y, 'Sack')
		this.sackSize = 0
	}
	jump() {
		if (this.body.onFloor()) {
			this.setVelocityY(-200)
		}
	}
	update() {
		this.setVelocityX(0)
		if (this.btnIs('left')) {
			this.setVelocityX(-100)
		}
		if (this.btnIs('right')) {
			this.setVelocityX(100)
		}
		if (this.body.velocity.x > 0) {
			this.setFlipX(false)
			this.sack.x = this.x - 8
		} else if (this.body.velocity.x < 0) {
			this.setFlipX(true)
			this.sack.x = this.x + 6
		}
		this.sack.y = this.y
		if (this.body.velocity.x != 0) {
			this.anims.play('santa_walk', true)
		} else {
			this.anims.play('santa_idle', true)
		}
		if (!this.body.onFloor()) {
			this.anims.play('santa_jump', true)
		}
		this.sack.setFrame(this.sackSize)
	}
	btnIs(btn) {
		return this.scene.pads.getAll().some((pad) => pad[btn]) || this.scene.keys[btn].isDown
	}
}
