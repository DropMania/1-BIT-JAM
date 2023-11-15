export default class UI extends Phaser.Scene {
	constructor(game) {
		super({ key: 'UI' })
		this.game = game
		Phaser.Scene.call(this, { key: 'UI', active: true })
	}
	create() {


		this.scene.setVisible(false, 'UI')

		this.lifesImg = this.add.sprite(50, 50, 'Lifes', this.registry.get('player_health'))
		this.lifesImg.setOrigin(0)

		// this.healthDisplay = this.add
		// 	.text(100, 100, this.registry.get('player_health'), {
		// 		fill: '#fff',
		// 		fontSize: '34px',
		// 		fontFamily: 'manaspc',
		// 	})
		// 	.setStroke('#000', 5)
		// 	.setResolution(5)
		// 	.setDepth(10)
	}

	update() {
		let playerHealth = this.registry.get('player_health')
		this.lifesImg.setFrame( playerHealth)
		// this.healthDisplay.setText(playerHealth)
	}
}
