import parse from '@/parse';
import compile from '@/compile';
import authors from './people.json';
import packsJson from './repo.json';
import { IPack } from '@/pack';

const packs = packsJson as IPack[];

const [validType, invalidType, allType] = compile(
	parse('type:Expressions type:InvalidStuff Expressions'),
	authors,
	packs
);

describe('filterparser/compile.ts/TypeMatcher', () => {
	it('should be created from type matcher', () => {
		expect(validType).toMatchInlineSnapshot(`
		TypeMatcher {
		  "matchingTypes": Set {
		    "Expressions",
		  },
		}
	`);
		expect(invalidType).toMatchInlineSnapshot(`
		TypeMatcher {
		  "matchingTypes": Set {},
		}
	`);
		expect(allType).toMatchInlineSnapshot(`
		AllMatcher {
		  "matchers": Array [
		    TypeMatcher {
		      "matchingTypes": Set {
		        "Expressions",
		      },
		    },
		    PackMatcher {
		      "isImpossible": false,
		      "payload": "expressions",
		    },
		  ],
		}
	`);
	});

	it('should return whether the match is impossible', () => {
		expect(validType.isImpossible).toBeFalsy();
		expect(invalidType.isImpossible).toBeTruthy();
		expect(allType.isImpossible).toBeFalsy();
	});

	it('should properly match packs with the type', () => {
		expect(validType.match(char1Pack)).toBeTruthy();
		expect(invalidType.match(char1Pack)).toBeFalsy();
		expect(allType.match(char1Pack)).toBeTruthy();

		expect(validType.match(char2Pack)).toBeFalsy();
		expect(invalidType.match(char2Pack)).toBeFalsy();
		expect(allType.match(char2Pack)).toBeFalsy();
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
