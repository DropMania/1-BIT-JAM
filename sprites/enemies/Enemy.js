export default class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, props, texture) {
		super(scene, x, y, texture)

		this.scene = scene
		this.scene.add.existing(this)
		this.scene.physics.add.existing(this)

		this.speed = 50
	}

	update() {}
}
