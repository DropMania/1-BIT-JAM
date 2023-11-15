import Dog from './enemies/Dog.js'
import TestDog from './enemies/TestDog.js'

export function createEnemie(scene, enemie, x, y, props) {
	switch (enemie) {
		case 'dog':
			return new Dog(scene, x, y, props)
			break
		case 'TestDog':
			return new TestDog(scene, x, y, props)
			break
		default:
			break
	}
}
