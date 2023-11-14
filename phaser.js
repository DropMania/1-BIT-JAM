import LoadingScreen from './scenes/LoadingScreen.js'
import Loading from './scenes/Loading.js'
import Menu from './scenes/Menu.js'
import Settings from './scenes/Settings.js'
import Credits from './scenes/Credits.js'
import World from './scenes/World.js'
import Level from './scenes/Level.js'
import UI from './scenes/UI.js'
import Story from './scenes/Stroy.js'
new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	pixelArt: true,
	backgroundColor: '#000',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			fps: 60,
			fixedStep: true,
			//debug: true,
		},
	},

	fps: {
		target: 60,
		deltaHistory: 10,
		smoothStep: true,
		min: 60,
		forceSetTimeOut: true,
	},

	render: {
		preserveDrawingBuffer: true,
	},

	powerPreference: 'high-performance',
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 1280,
		height: 720,
		autoRound: true,
	},
	input: {
		gamepad: true,
		keyboard: true,
	},
	plugins: {
		scene: [
			{
				key: 'PhaserRaycaster',
				plugin: PhaserRaycaster,
				mapping: 'raycasterPlugin',
			},
		],
	},
	scene: [LoadingScreen, Loading, Menu, Settings, Credits, World, Level, Story, UI],
})
