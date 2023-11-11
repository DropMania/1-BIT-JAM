export default class Dog extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, props) {
		super(scene, x, y, 'Dog')

		this.scene = scene
		this.scene.add.existing(this)
		this.scene.physics.add.existing(this)
		this.body.setCollideWorldBounds(true)
		this.scene.anims.createFromAseprite('Dog')

		// this.ray = this.scene.raycaster.createRay()
	}

	update() {
		this.anims.play('dog_idle', true)
	}
}
