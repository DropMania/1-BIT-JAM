import Enemy from './Enemy.js'
export default class TestDog extends Enemy {
	constructor(scene, x, y, props) {
		super(scene, x, y, props, 'Dog')

		this.props = props
		this.setGravityY(50)

		this.ray = this.scene.raycaster.createRay({
			origin: {
				x: this.x,
				y: this.y,
			},
			detectionRange: 100,
		})

		this.graphics = this.scene.add.graphics({
			lineStyle: { width: 1, color: 0x00ff00 },
			fillStyle: { color: 0xffffff, alpha: 0.3 },
		})
		this.graphics.strokeCircleShape({
			x: this.ray.origin.x,
			y: this.ray.origin.y,
			radius: this.ray.detectionRange,
		})
		this.graphics.fillStyle(0xff00ff)
	}

	update() {
		this.anims.play('dog_idle', true)

		// this.setOrigin(0,0)
		this.ray.setOrigin(this.x, this.y)

		this.graphics.clear()

		// this.graphics.lineStyle(1, 0x00ff00)

		let CircleIntersections = this.ray.castCircle()

		for (let CircleIntersection of CircleIntersections) {
			if (!CircleIntersection.object && CircleIntersection.object === undefined) {
				return
			}
			// debugger
			this.graphics.fillStyle(0xff0000)
			this.graphics.lineStyle(5, 0x00ff00)
			this.graphics.strokeCircleShape({
				x: this.ray.origin.x,
				y: this.ray.origin.y,
				radius: this.ray.detectionRange / 2,
			})
		}

		// console.log(intersection);
		// if (intersection.object && intersection.object !== this) {
		//     debugger
		// 	// let distance = Phaser.Math.Distance.Between(this.x, this.y, intersection.x, intersection.y)

		// 	/* follow player */
		// 	if (distance < 15) {

		// 	} else if (distance < 100) {

		// 	} else {

		// 	}
		// } else {

		// }
	}
}
