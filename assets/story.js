export default {
	intro: {
		text: 'You need to deliver all the presents Santa!\n And clear your whole bag!',
		next: 'intro2',
	},
	intro2: {
		text: 'You have to get rid of every present\n before the sun rises!',
		levelSpawn: 'begin',
	},
	grinch: {
		text: 'Oh no! The Grinch wants to ruin Christmas!\n You need to stop him!',
		next: 'grinch2',
	},
	grinch2: {
		text: 'He is hiding to the east of the city.',
	},
	end: {
		text: 'You did it! You delivered all the presents!\n And defeated the Grinch!',
		next: 'end2',
	},
	end2: {
		text: 'You are the best Santa ever!',
		next: 'end3',
	},
	end3: {
		text: 'Thank you for playing!',
		levelSpawn: 'credits',
	},
}
