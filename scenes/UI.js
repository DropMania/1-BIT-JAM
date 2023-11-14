export default class UI extends Phaser.Scene {
	constructor(game) {
		super()
		this.game = game
		Phaser.Scene.call(this, { key: 'UI', active: true })
	}
	init({}) {}
	preload() {}
	create() {
		this.scene.get('Loading').events.on('loaded', () => {
			// this.setup()
		})

		this.scene.setVisible(false, 'UI')

		this.lifesImg = this.add.sprite(100, 160, 'Lifes', 0)
		this.lifesImg.setVisible(true)

		this.healthDisplay = this.add
			.text(100, 100, this.registry.get('player_health'), {
				fill: '#fff',
				fontSize: '34px',
				fontFamily: 'manaspc',
			})
			.setStroke('#000', 5)
			.setResolution(5)
			.setDepth(10)
	}

	update() {
		this.healthDisplay.setText(this.registry.get('player_health'))
	}
}
