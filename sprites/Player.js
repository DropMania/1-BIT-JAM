export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'Santa')
		/**
		 * @type {Phaser.Scene}
		 */
		this.scene = scene
		this.scene.add.existing(this)
		this.scene.physics.add.existing(this)
		this.setGravityY(500)
		this.scene.keys.jump.on('down', () => {
			this.jump()
		})
		this.scene.keys.dash.on('down', () => {
			this.dash()
		})
		this.scene.pads.on('down', (pad, button) => {
			if (button.index == 0) {
				this.jump()
			}
			if (button.index == 2) {
				this.dash()
			}
		})
		this.sack = this.scene.add.sprite(this.x - 8, this.y, 'Sack')
		this.sack.setDepth(9)
		this.sackSize = this.scene.registry.get('state').sackSize
		this.stopped = false
		this.speed = 100
		this.isDashing = false
		this.dashCooldown = false
		this.stoppedType = ''
		this.isKnockbacked = false
	}
	jump(height=-200) {
		if (this.body.onFloor() && !this.stopped) {
			this.setVelocityY(height)
		}
	}
	dash() {
		if (this.stopped || this.isDashing || this.dashCooldown) return
		this.isDashing = true
		this.speed = 300
		this.alpha = 0.8
		this.scene.time.delayedCall(200, () => {
			this.speed = 100
			this.alpha = 1
			this.isDashing = false
			this.dashCooldown = true
			this.scene.time.delayedCall(500, () => {
				this.dashCooldown = false
			})
		})
	}
	update() {
		this.sack.setFrame(this.sackSize)
		this.sack.y = this.y
		if (this.stopped) return
		if (!this.isKnockbacked) {
			this.setVelocityX(0)
		}
		if (this.btnIs('left')) {
			this.setVelocityX(-this.speed)
		}
		if (this.btnIs('right')) {
			this.setVelocityX(this.speed)
		}
		if (this.body.velocity.x > 0) {
			this.setFlipX(false)
			this.sack.x = this.x - 8
		} else if (this.body.velocity.x < 0) {
			this.setFlipX(true)
			this.sack.x = this.x + 6
		}
		if (this.body.velocity.x != 0) {
			this.anims.play('santa_walk', true)
		} else {
			this.anims.play('santa_idle', true)
		}
		if (!this.body.onFloor()) {
			this.anims.play('santa_jump', true)
		}
		if (this.isDashing) {
			this.anims.play('santa_jump', true)
		}
	}
	btnIs(btn) {
		return this.scene.pads.getAll().some((pad) => pad[btn]) || this.scene.keys[btn].isDown
	}
	stop(type) {
		this.stopped = true
		this.setVelocityX(0)
		if (type == 'GameOver') {
			this.anims.play(
				{
					key: 'santa_death',
					frameRate: 15,
					repeat: 0,
				},
				true
			)
			this.sack.setVisible(false)
		} else if (type == 'Finish') {
			this.anims.play(
				{
					key: 'santa_win',
					frameRate: 15,
					repeat: 0,
				},
				true
			)
			this.sack.setVisible(false)
		} else {
			this.anims.play('santa_idle', true)
		}
	}
	hit(enemie) {
		if (this.isKnockbacked) return
		if (this.stopped) return
		console.log('player hit')
		this.isKnockbacked = true
		let playerHealth = this.scene.registry.get('player_health') - 1
		playerHealth = playerHealth < 0 ? 0 : playerHealth
		if (this.body.velocity.x > 0) {
			this.setVelocity(-200, -200)
		} else if (this.body.velocity.x < 0) {
			this.setVelocity(100, -200)
		} else {
			if (this.flipX) {
				this.setVelocity(-200, -200)
			} else {
				this.setVelocity(100, -200)
			}
		}
		this.scene.registry.set('player_health', playerHealth)
		if (playerHealth == 0) {
			this.scene.gameOver()
		} else {
			this.scene.time.addEvent({
				delay: 500,
				callback: () => {
					this.isKnockbacked = false
				},
			})
		}
	}
}
