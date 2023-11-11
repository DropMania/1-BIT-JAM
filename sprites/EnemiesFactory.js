import Dog from './enemies/Dog.js'

export function createEnemie(scene, enemie, x, y, props) {
	switch (enemie) {
		case 'dog':
			return new Dog(scene, x, y, props)
			break
		default:
			break
	}
}
