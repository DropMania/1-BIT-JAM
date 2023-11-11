export default class Sleigh extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'Sleigh')
		/**
		 * @type {Phaser.Scene}
		 */
		this.scene = scene
		this.scene.add.existing(this)
		this.scene.physics.add.existing(this)
		this.body.setCollideWorldBounds(true)
	}
	update() {
		if (this.btnIs('down') && this.btnIs('left')) {
			this.setVelocityY(40)
			this.setVelocityX(-40)
			this.setRotation(Phaser.Math.DegToRad(135))
		} else if (this.btnIs('down') && this.btnIs('right')) {
			this.setVelocityY(40)
			this.setVelocityX(40)
			this.setRotation(Phaser.Math.DegToRad(45))
		} else if (this.btnIs('up') && this.btnIs('left')) {
			this.setVelocityY(-40)
			this.setVelocityX(-40)
			this.setRotation(Phaser.Math.DegToRad(-135))
		} else if (this.btnIs('up') && this.btnIs('right')) {
			this.setVelocityY(-40)
			this.setVelocityX(40)
			this.setRotation(Phaser.Math.DegToRad(-45))
		} else {
			if (this.btnIs('down')) {
				this.setVelocityY(60)
				this.setRotation(Phaser.Math.DegToRad(90))
			} else if (this.btnIs('up')) {
				this.setVelocityY(-60)
				this.setRotation(Phaser.Math.DegToRad(270))
			} else {
				this.setVelocityY(0)
			}
			if (this.btnIs('left')) {
				this.setVelocityX(-60)
				this.setRotation(Phaser.Math.DegToRad(180))
			} else if (this.btnIs('right')) {
				this.setVelocityX(60)
				this.setRotation(Phaser.Math.DegToRad(0))
			} else {
				this.setVelocityX(0)
			}
		}
		this.anims.play('sleigh_fly', true)
	}

	btnIs(btn) {
		return this.scene.pads.getAll().some((pad) => pad[btn]) || this.scene.keys[btn].isDown
	}
	isWalking() {
		return this.body.velocity.x != 0 || this.body.velocity.y != 0
	}
}
