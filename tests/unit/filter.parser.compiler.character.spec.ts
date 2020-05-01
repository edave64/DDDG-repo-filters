import parse from '@/parse';
import compile from '@/compile';
import authors from './people.json';
import packsJson from './repo.json';
import { IPack } from '@/pack';

const packs = packsJson as IPack[];

const [validCharacter, invalidCharacter, allCharacter] = compile(
	parse('character:Monika character:InvalidStuff Monika'),
	authors,
	packs
);

describe('filterparser/compile.ts/AuthorMatcher', () => {
	it('should be created from author matcher', () => {
		expect(validCharacter).toMatchInlineSnapshot(`
		CharacterMatcher {
		  "matchingCharacters": Set {
		    "Monika",
		    "Monika R63",
		  },
		}
		`);
		expect(invalidCharacter).toMatchInlineSnapshot(`
		CharacterMatcher {
		  "matchingCharacters": Set {},
		}
		`);
		expect(allCharacter).toMatchInlineSnapshot(`
		AllMatcher {
		  "matchers": Array [
		    CharacterMatcher {
		      "matchingCharacters": Set {
		        "Monika",
		        "Monika R63",
		      },
		    },
		    PackMatcher {
		      "isImpossible": false,
		      "payload": "monika",
		    },
		  ],
		}
	`);
	});

	it('should return whether the match is impossible', () => {
		expect(validCharacter.isImpossible).toBeFalsy();
		expect(invalidCharacter.isImpossible).toBeTruthy();
		expect(allCharacter.isImpossible).toBeFalsy();
	});

	it('should properly match packs with the author', () => {
		expect(validCharacter.match(char1Pack)).toBeTruthy();
		expect(invalidCharacter.match(char1Pack)).toBeFalsy();
		expect(allCharacter.match(char1Pack)).toBeTruthy();

		expect(validCharacter.match(char2Pack)).toBeFalsy();
		expect(invalidCharacter.match(char2Pack)).toBeFalsy();
		expect(allCharacter.match(char2Pack)).toBeFalsy();
	});
});

const char1Pack: IPack = {
	id: 'monika.expressions.angry.lunatic_rabbit.edave64',
	name: 'Angry expressions',
	characters: ['Monika'],
	authors: ['Lunatic Rabbit'],
	kind: ['Expressions'],
	source: 'https://www.reddit.com/8wenmt',
	dddg1Path:
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/monika/expressions/angry.lunatic_rabbit.edave64/index.json',
	dddg2Path:
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/monika/expressions/angry.lunatic_rabbit.edave64/index.json',
	description:
		"<a href='https://www.reddit.com/8wenmt' target='_blank' rel='noopener noreferrer'>Created by</a> Lunatic_Rabbit",
	preview: [
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/monika/expressions/angry.lunatic_rabbit.edave64/a.png',
	],
	searchWords: [],
};

const char2Pack: IPack = {
	id: 'mc.oufits.shirtVest.plural_roses.edave64',
	name: 'Shirt and Vest',
	characters: ['MC'],
	authors: ['Plural Roses'],
	kind: ['Styles'],
	source: 'https://www.reddit.com/en9ezu',
	dddg1Path:
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/mc.oufits.shirtVest.plural_roses.edave64/index.json',
	dddg2Path:
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/mc.oufits.shirtVest.plural_roses.edave64/index.json',
	description:
		"Created by PluralRoses (<a href='https://www.deviantart.com/15laruea' target='_blank' rel='noopener noreferrer'>DeviantArt</a>)",
	preview: [
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/mc.oufits.shirtVest.plural_roses.edave64/1l.png',
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/mc.oufits.shirtVest.plural_roses.edave64/1r.png',
	],
	searchWords: [],
};
