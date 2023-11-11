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
			this.setup()
		})
	}
}
