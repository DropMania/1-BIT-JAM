import Enemy from './Enemy.js'
export default class Dog extends Enemy {
	constructor(scene, x, y, props) {
		super(scene, x, y, props, 'Dog')

		this.spawnPos = {
			x: x,
			y: y,
		}
		this.setGravityY(50)
		this.rotation = 0
		this.ray = this.scene.raycaster.createRay({
			x: this.x,
			y: this.y,
			angle: 0,
			range: 5,
			detectionRange: 5,
			collisionRange: 5,
			ignoreNotIntersectedRays: true,
			cone: 20,
		})

		this.speed = 50
		this.playerDetected = false
		this.isMoving = false
		this.isReturning = false
		this.isAttacking = false
		this.isAttackCooldown = false
		this.isBack = true

		this.nextPatrollPoint = {
			x: 400,
		}

		this.flipX = false

		this.scene.time.addEvent({
			delay: 2000,
			callback: () => {
				if (this.isMoving || this.isWaiting) {
					return
				}
				this.flipX = !this.flipX
			},
			loop: true,
		})
	}

	update() {
		if (this.body.velocity.x > 0) {
			this.setFlipX(false)
		} else if (this.body.velocity.x < 0) {
			this.setFlipX(true)
		}

		if (this.isAttacking) {
			this.anims.play('dog_attack', true)
		} else if (!this.isMoving) {
			this.anims.play('dog_idle', true)
		} else if (this.isMoving) {
			this.anims.play('dog_run', true)
		}

		this.ray.setOrigin(this.x, this.y)

		if (this.flipX) {
			this.ray.setAngleDeg(180)
		} else {
			this.ray.setAngleDeg(0)
		}

		let intersection = this.ray.cast()
		if (intersection.object && intersection.object !== this) {
			let distance = Phaser.Math.Distance.Between(this.x, this.y, intersection.x, intersection.y)

			/* follow player */
			if (distance < 15) {
				if (!this.scene.player.isDashing && !this.scene.player.stopped && !this.isAttackCooldown) {
					this.setVelocity(0)
					if (!this.isAttacking) {
						this.isAttacking = true
						this.isAttackCooldown = true
						this.scene.time.addEvent({
							delay: 200,
							callback: () => {
								this.isAttacking = false
								if (Phaser.Math.Distance.Between(this.x, this.y, intersection.x, intersection.y) < 15) {
									this.scene.player.hit(this)
								}
							},
						})
						this.scene.time.addEvent({
							delay: 1000,
							callback: () => {
								this.isAttackCooldown = false
							},
						})
					}
				}
			} else if (distance < 100) {
				console.log('too close RUN!')
				this.playerDetected = true
				this.isMoving = true
				this.isBack = false

				this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, this.speed)
				/* nothing to see */
			} else {
				console.log('must have been the wind!')
				if (this.playerDetected) {
					this.playerDetected = false
					if (this.isReturning) {
						this.waitForReturn()
					}
				}
			}
		} else {
			/* move back to origin */
			if (this.playerDetected) {
				this.playerDetected = false
				if (!this.isReturning) {
					this.waitForReturn()
				}
			}
		}

		if (this.isReturning) {
			this.moveBackToOrigin()
		}
	}

	waitForReturn() {
		if (!this.isWaiting) {
			this.isMoving = false
			this.isWaiting = true
			this.setVelocity(0)
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => {
					this.isReturning = true
					this.isMoving = true
					this.isWaiting = false
				},
			})
		}
	}

	moveBackToOrigin() {
		let distance = Phaser.Math.Distance.Between(this.x, this.y, this.spawnPos.x, this.spawnPos.y)
		if (distance > 10 && !this.playerDetected) {
			let returnSpeed =
				(this.speed * distance) / this.speed > this.speed
					? this.speed
					: (this.speed * distance) / this.speed < 10
					? 10
					: (this.speed * distance) / this.speed

			this.scene.physics.moveTo(this, this.spawnPos.x, this.y, returnSpeed)
		} else {
			this.setVelocity(0)
			this.isMoving = false
			this.isReturning = false
		}
	}
}
