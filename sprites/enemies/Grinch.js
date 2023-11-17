export default class Grinch extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'Grinch')

		this.scene = scene
		this.scene.add.existing(this)
		this.scene.physics.add.existing(this)
		this.grinchTween = this.scene.tweens.add({
			targets: this,
			x: this.scene.map.widthInPixels / 2 + 100,
			duration: 2000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
		})
		this.scene.time.addEvent({
			delay: 2000,
			callback: () => {
				if (this.dead) return
				this.shoot()
			},
			loop: true,
		})
		this.isShooting = false
		this.dead = false
		this.projectiles = this.scene.add.group()
		this.scene.physics.add.collider(this.projectiles, this.scene.player, (projectile, player) => {
			projectile.destroy()
			player.hit()
		})
	}
	shoot() {
		this.isShooting = true
		this.createProjectile()
		this.scene.time.delayedCall(500, () => {
			this.isShooting = false
		})
	}
	update() {
		if (this.dead) return this.anims.play('grinch_dead', true)
		if (this.isShooting) {
			this.anims.play('grinch_shoot', true)
		} else {
			this.anims.play('grinch_idle', true)
		}
		this.projectiles.children.iterate((projectile) => {
			projectile.anims.play('ball_spin', true)
			projectile.setVelocityX(Math.cos(projectile.dir) * 100)
			projectile.setVelocityY(Math.sin(projectile.dir) * 100)
		})
	}
	createProjectile() {
		let projectile = this.scene.physics.add.sprite(this.x, this.y, 'Ball')
		projectile.setDepth(10)
		projectile.setOrigin(0.5, 0.5)
		projectile.dir = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y)
		this.scene.time.delayedCall(5000, () => {
			if (!projectile.body) return
			projectile.destroy()
		})
		this.projectiles.add(projectile)
	}
}
