import story from '../assets/story.js'
export default class Loading extends Phaser.Scene {
	constructor(game) {
		super({ key: 'Loading', active: true })

		this.game = game
	}
	preload() {
		this.load.setBaseURL('assets/')
		this.sprites = ['Santa', 'Sack', 'Snow', 'Dog', 'Sleigh', 'Lifes', 'Child', 'Grinch', 'Ball', 'Switch']
		this.static = ['Tree', 'Presents', 'Check', 'Block', 'Border', 'GrinchWorld', 'Platform']
		this.images = [
			'FloorIsLava',
			'Controls',
			'BewareOfDogs',
			'ArrowUp',
			'ArrowDown',
			'ArrowLeft',
			'ArrowRight',
			'UseDash',
			'TreeThatWay',
			'Jump',
			'Switches',
			'Town',
		]
		this.sfx = ['fanfare', 'gameOver', 'text_1', 'text_2', 'text_3', 'jump', 'hit', 'menu', 'dash']
		this.songs = ['winter', 'overworld', 'happy']
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
		this.songs.forEach((song) => {
			this.load.audio(song, `sound/music/${song}.ogg`)
		})
		this.load.image('tileset', 'tileset.png')
		this.load.tilemapTiledJSON(`level_begin`, `levels/level_begin.json`)
		this.load.tilemapTiledJSON(`level_grinch`, `levels/level_grinch.json`)
		for (var i = 0; i <= 5; i++) {
			this.load.tilemapTiledJSON(`level_${i}`, `levels/level_${i}.json`)
		}
		this.load.tilemapTiledJSON('world', 'world/world.json')
		this.load.image('world', 'world/world.png')
		Object.values(story).forEach((s) => {
			if (s.img) {
				this.load.image(`story_${s.img}`, `sprites/story/${s.img}.png`)
			}
		})
	}
	create() {
		if (localStorage.getItem('volume') === null) {
			let vol = Math.round(this.sound.volume * 10).toFixed(0)
			localStorage.setItem('volume', vol)
		} else {
			this.sound.volume = (Number(localStorage.getItem('volume')) / 10).toFixed(1)
		}

		this.sprites.forEach((sprite) => {
			this.anims.createFromAseprite(sprite)
		})

		this.events.emit('loaded')
		this.scene.start('Menu')
	}
}
