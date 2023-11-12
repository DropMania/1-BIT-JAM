export default class Loading extends Phaser.Scene {
	constructor(game) {
		super({ key: 'Loading', active: true })

		this.game = game
	}
	preload() {
		this.load.setBaseURL('assets/')
		this.sprites = ['Santa', 'Sack', 'Snow', 'Dog', 'Sleigh']
		this.static = ['Tree', 'Presents', 'Check', 'Block', 'Border']
		this.images = ['FloorIsLava', 'Controls']
		this.sfx = ['fanfare', 'gameOver', 'text_1', 'text_2', 'text_3']
		this.sprites.forEach((sprite) => {
			this.load.aseprite(sprite, `sprites/${sprite}/${sprite}.png`, `sprites/${sprite}/${sprite}.json`)
		})
		this.static.forEach((sprite) => {
			this.load.image(sprite, `sprites/static/${sprite}.png`)
		})
		this.images.forEach((image) => {
			this.load.image(image, `sprites/imgs/${image}.png`)
		})
		this.sfx.forEach((sfx) => {
			this.load.audio(sfx, `sound/sfx/${sfx}.ogg`)
		})
		this.load.image('tileset', 'tileset.png')
		this.load.tilemapTiledJSON(`level_begin`, `levels/level_begin.json`)
		for (var i = 0; i <= 3; i++) {
			this.load.tilemapTiledJSON(`level_${i}`, `levels/level_${i}.json`)
		}
		this.load.tilemapTiledJSON('world', 'world/world.json')
		this.load.image('world', 'world/world.png')
	}
	create() {
		this.sprites.forEach((sprite) => {
			this.anims.createFromAseprite(sprite)
		})

		this.events.emit('loaded')
		this.scene.start('Menu')
	}
}
