export default {
	intro: {
		text: "It's Christmas Eve, Santa.\n You need to deliver all the presents!",
		img: 'intro',
		next: 'intro2',
	},
	intro2: {
		text: 'You have to clear your whole bag\n before the sun rises!',
		img: 'intro2',
		levelSpawn: 'begin',
	},
	grinch: {
		text: 'Oh no! The Grinch wants to ruin Christmas!\n You need to stop him!',
		img: 'grinch',
		next: 'grinch2',
	},
	grinch2: {
		text: 'He is hiding to the east of the city.',
		img: 'grinch2',
	},
	end: {
		text: 'You did it! You delivered all the presents!\n And defeated the Grinch!',
		next: 'end2',
		img: 'end',
	},
	end2: {
		text: 'You are the best Santa ever!',
		next: 'end3',
		img: 'end2',
	},
	end3: {
		text: 'Thank you for playing!',
		levelSpawn: 'credits',
		img: 'end3',
	},
}
