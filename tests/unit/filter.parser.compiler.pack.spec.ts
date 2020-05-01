import parse from '@/parse';
import compile from '@/compile';
import authors from './people.json';
import packsJson from './repo.json';
import { IPack } from '@/pack';

const packs = packsJson as IPack[];

const [validPack, invalidPack, searchWord, allPack] = compile(
	parse('pack:Angry pack:InvalidStuff pack:word1 Angry'),
	authors,
	packs
);

describe('filterparser/compile.ts/TypeMatcher', () => {
	it('should be created from type matcher', () => {
		expect(validPack).toMatchInlineSnapshot(`
		PackMatcher {
		  "isImpossible": false,
		  "payload": "angry",
		}
	`);
		expect(invalidPack).toMatchInlineSnapshot(`
		PackMatcher {
		  "isImpossible": true,
		  "payload": "invalidstuff",
		}
	`);
		expect(allPack).toMatchInlineSnapshot(`
		AllMatcher {
		  "matchers": Array [
		    PackMatcher {
		      "isImpossible": false,
		      "payload": "angry",
		    },
		  ],
		}
	`);
	});

	it('should return whether the match is impossible', () => {
		expect(validPack.isImpossible).toBeFalsy();
		expect(invalidPack.isImpossible).toBeTruthy();
		expect(allPack.isImpossible).toBeFalsy();
	});

	it('should properly match packs with the type', () => {
		expect(validPack.match(pack1Pack)).toBeTruthy();
		expect(invalidPack.match(pack1Pack)).toBeFalsy();
		expect(allPack.match(pack1Pack)).toBeTruthy();

		expect(validPack.match(pack2Pack)).toBeFalsy();
		expect(invalidPack.match(pack2Pack)).toBeFalsy();
		expect(allPack.match(pack2Pack)).toBeFalsy();
	});

	it('should support search words', () => {
		const [searchWord] = compile(parse('pack:word1'), authors, [
			pack1Pack,
			pack2Pack,
		]);
		expect(searchWord).toMatchInlineSnapshot(`
		PackMatcher {
		  "isImpossible": false,
		  "payload": "word1",
		}
	`);
		expect(searchWord.isImpossible).toBeFalsy();
		expect(searchWord.match(pack1Pack)).toBeTruthy();
		expect(searchWord.match(pack2Pack)).toBeFalsy();
	});
});

const pack1Pack: IPack = {
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
	searchWords: ['SearchWord1'],
};

const pack2Pack: IPack = {
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
	searchWords: ['SearchWord2'],
};
