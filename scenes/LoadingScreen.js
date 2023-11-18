export default class LoadingScreen extends Phaser.Scene {
	constructor(game) {
		super({ key: 'LoadingScreen', active: true })

		this.game = game
	}
	preload() {}
	create() {
		this.registry.set('game_title', 'Christmas Madness')
		this.registry.set('player_health', 0)

		this.add
			.text(this.game.config.width / 2, this.game.config.height / 2, 'Loading ...', {
				fill: '#fff',
				fontSize: '32px',
				fontFamily: 'manaspc',
				align: 'center',
			})
			.setResolution(5)
			.setOrigin(0.5, 0.5)
		this.scene.get('Loading').events.on('loaded', () => {
			this.scene.stop()
		})
	}
}
