import { describe, expect, it } from 'vitest';
import compile from '@/compile';
import type { IPack } from '@/pack';
import parse from '@/parse';
import authors from './people.json';
import packsJson from './repo.json';

const packs = packsJson as IPack[];

const [
	validCharacter,
	invalidCharacter,
	allCharacter,
	validCharacterId,
	invalidCharacterId,
] = compile(
	parse(
		'character:Monika character:InvalidStuff Monika character:Monika;dddg.buildin.base.monika:ddlc.monika character:InvalidStuff;dddg.invalid.monika:ddlc.monika',
	),
	authors,
	packs,
);

describe('filterparser/compile.ts/CharacterMatcher', () => {
	it('should be created from character matcher', () => {
		expect(validCharacter).toMatchInlineSnapshot(`
		CharacterMatcher {
		  "matchingCharacterIds": null,
		  "matchingCharacters": Set {
		    "Monika",
		    "Monika R63",
		  },
		}
		`);
		expect(invalidCharacter).toMatchInlineSnapshot(`
			CharacterMatcher {
			  "matchingCharacterIds": null,
			  "matchingCharacters": Set {},
			}
		`);
		expect(validCharacterId).toMatchInlineSnapshot(`
			CharacterMatcher {
			  "matchingCharacterIds": Set {
			    "dddg.buildin.base.monika:ddlc.monika",
			  },
			  "matchingCharacters": Set {
			    "Monika",
			    "Monika R63",
			  },
			}
		`);
		expect(invalidCharacterId).toMatchInlineSnapshot(`
			CharacterMatcher {
			  "matchingCharacterIds": Set {},
			  "matchingCharacters": Set {},
			}
		`);
		expect(allCharacter).toMatchInlineSnapshot(`
			AllMatcher {
			  "matchers": [
			    CharacterMatcher {
			      "matchingCharacterIds": null,
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
		expect(validCharacterId.isImpossible).toBeFalsy();
		expect(invalidCharacterId.isImpossible).toBeTruthy();
	});

	it('should properly match packs with the character', () => {
		expect(validCharacter.match(char1Pack)).toBeTruthy();
		expect(invalidCharacter.match(char1Pack)).toBeFalsy();
		expect(allCharacter.match(char1Pack)).toBeTruthy();

		expect(validCharacter.match(char2Pack)).toBeFalsy();
		expect(invalidCharacter.match(char2Pack)).toBeFalsy();
		expect(allCharacter.match(char2Pack)).toBeFalsy();

		expect(validCharacterId.match(char1Pack)).toBeTruthy();
		expect(invalidCharacterId.match(char1Pack)).toBeFalsy();
	});
});

const char1Pack: IPack = {
	id: 'monika.expressions.angry.lunatic_rabbit.edave64',
	name: 'Angry expressions',
	characters: ['Monika'],
	characterIds: ['dddg.buildin.base.monika:ddlc.monika'],
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
	characterIds: ['dddg.buildin.base.mc:ddlc.mc'],
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
