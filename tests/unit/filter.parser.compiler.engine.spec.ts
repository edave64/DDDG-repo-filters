import parse from '@/parse';
import compile from '@/compile';
import authors from './people.json';
import packsJson from './repo.json';
import { IPack } from '@/pack';

const packs = packsJson as IPack[];

const [validEngine, invalidEngine, allEngine] = compile(
	parse('engine:DDCC engine:InvalidStuff DDCC'),
	authors,
	packs
);

describe('filterparser/compile.ts/TypeMatcher', () => {
	it('should be created from type matcher', () => {
		expect(validEngine).toMatchInlineSnapshot(`
		EngineMatcher {
		  "matchingProps": Array [
		    "ddcc2Path",
		  ],
		}
	`);
		expect(invalidEngine).toMatchInlineSnapshot(`
		EngineMatcher {
		  "matchingProps": Array [],
		}
	`);
		expect(allEngine).toMatchInlineSnapshot(`
		AllMatcher {
		  "matchers": Array [
		    EngineMatcher {
		      "matchingProps": Array [
		        "ddcc2Path",
		      ],
		    },
		  ],
		}
	`);
	});

	it('should return whether the match is impossible', () => {
		expect(validEngine.isImpossible).toBeFalsy();
		expect(invalidEngine.isImpossible).toBeTruthy();
		expect(allEngine.isImpossible).toBeFalsy();
	});

	it('should properly match packs with the type', () => {
		expect(validEngine.match(engine1Pack)).toBeTruthy();
		expect(invalidEngine.match(engine1Pack)).toBeFalsy();
		expect(allEngine.match(engine1Pack)).toBeTruthy();

		expect(validEngine.match(engine2Pack)).toBeFalsy();
		expect(invalidEngine.match(engine2Pack)).toBeFalsy();
		expect(allEngine.match(engine2Pack)).toBeFalsy();
	});
});

const engine1Pack: IPack = {
	id: 'monika.outfit.casual-tucked.destinypvegal.edave64',
	name: 'Casual Outfit (Tucked in)',
	characters: ['Monika'],
	authors: ['DestinyPvEGal'],
	ddcc2Path:
		'https://drive.google.com/open?id=1-jt7yG8dD67hlRTMyJdrhwmQIg7Tgyx8',
	kind: ['Styles'],
	source: 'https://www.reddit.com/8t62u7',
	dddg1Path:
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/monika/outfit/casual-tucked.destinypvegal.edave64/index.json',
	dddg2Path:
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/monika/outfit/casual-tucked.destinypvegal.edave64/index.json',
	description:
		"<a href='https://www.reddit.com/comments/8t62u7' target='_blank' rel='noopener noreferrer'>Created by</a> DestinyPvEGal",
	preview: [
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/monika/outfit/casual-tucked.destinypvegal.edave64/1l.png',
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/monika/outfit/casual-tucked.destinypvegal.edave64/1r.png',
	],
	searchWords: [],
};

const engine2Pack: IPack = {
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
