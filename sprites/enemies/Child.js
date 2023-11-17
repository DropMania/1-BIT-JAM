import Enemy from './Enemy.js'
export default class Child extends Enemy {
	constructor(scene, x, y, props) {
		super(scene, x, y, props, 'Child')

        this.scene = scene
        this.isStunned = false
        this.detectionRange = props.range !== undefined ? props.range : 50


		if(props.flip !== undefined ){
			this.flipX = props.flip
		}else{
			this.flipX = false
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

		this.scene.time.addEvent({
			delay: 2000,
			callback: () => {
				if (this.isStunned) {return}
				this.flipX = !this.flipX
			},
			loop: true,
		})
	}

	update() {

        if(this.isStunned){
            this.anims.play('child_stun', true)
        }else{
            this.anims.play('child_idle', true)
        }
		

        if (this.body.velocity.x > 0) {
			this.setFlipX(false)
		} else if (this.body.velocity.x < 0) {
			this.setFlipX(true)
		}

        

		this.ray.setOrigin(this.x, this.y)
		if (this.flipX) {
			this.ray.setAngleDeg(180)
		} else {
			this.ray.setAngleDeg(0)
		}

		let intersection = this.ray.cast()
        if (intersection.object && intersection.object !== undefined){

            let distance = Phaser.Math.Distance.Between(this.x, this.y, intersection.x, intersection.y)
            if(distance < this.detectionRange){
                this.isStunned = true
    
                this.scene.gameOver()
            }
        }


	}


}
