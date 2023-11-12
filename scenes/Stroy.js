import story from '../assets/story.js'
export default class Story extends Phaser.Scene {
	constructor(game) {
		super({ key: 'Story' })
		this.game = game
	}
	init({ id }) {
		this.story = story[id]
	}
	preload() {}
	create() {
		let fullText = [...this.story.text]

		this.storyText = this.add
			.text(this.game.config.width / 2, 300, '', {
				fill: '#fff',
				fontSize: '32px',
				fontFamily: 'manaspc',
				align: 'center',
			})
			.setResolution(5)
		this.storyText.setLineSpacing(10)
		this.storyText.setOrigin(0.5, 0.5)
		this.textSounds = []
		for (let i = 1; i <= 3; i++) {
			this.textSounds.push(this.sound.add(`text_${i}`))
		}
		this.time.addEvent({
			delay: 50,
			callback: () => {
				if (fullText.length > 0) {
					this.textSounds[Phaser.Math.Between(0, 2)].play({})
					this.storyText.text += fullText.shift()
				}
			},
			repeat: fullText.length - 1,
		})

		this.skipText = this.add
			.text(1000, 650, 'Press Space to Continue', {
				fill: '#fff',
				fontSize: '20px',
				fontFamily: 'manaspc',
				align: 'center',
			})
			.setResolution(5)
		this.skipText.setOrigin(0.5, 0.5)
		this.skipText.visible = false
		this.time.addEvent({
			delay: 2000,
			callback: () => {
				this.skipText.visible = true
			},
		})

		if (this.story.img) {
			this.add
				.image(this.game.config.width / 2, 70, `story_${this.story.img}`)
				.setOrigin(0.5, 0)
				.setScale(5)
			this.add
				.image(this.game.config.width / 2, 70, `Border`)
				.setOrigin(0.5, 0)
				.setScale(5)

			this.storyText.y = 400
		}

		this.keys = this.input.keyboard.addKeys({
			space: Phaser.Input.Keyboard.KeyCodes.SPACE,
		})
		this.keys.space.on('down', this.continue, this)
		this.pads = this.input.gamepad
		this.time.addEvent({
			delay: 1,
			callback: () => {
				this.pads.on('down', (pad, btn) => {
					if (btn.index === 0) {
						this.continue()
					}
				})
			},
		})
	}
	continue() {
		if (this.story.next) {
			this.scene.start('Story', { id: this.story.next })
		} else {
			if (Object.keys(this.story).includes('levelSpawn')) {
				if (this.story.levelSpawn === 'credits') return this.scene.start('Credits')
				this.scene.start('Level', { level: this.story.levelSpawn })
			} else {
				this.scene.start('World')
			}
		}
	}
}
