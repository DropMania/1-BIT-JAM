export default class MenuButton {
	constructor(x, y, label, scene, callback) {
		const button = scene.add
			.text(x, y, label, {
				fontSize: '32px',
			})
			.setFixedSize(300, 60)
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: '#111' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => callback())
			.on('pointerover', () => button.setStyle({ fill: '#f39c12', backgroundColor: '#0066ff' }))
			.on('pointerout', () => button.setStyle({ fill: '#FFF', backgroundColor: '#111' }))
	}
}
