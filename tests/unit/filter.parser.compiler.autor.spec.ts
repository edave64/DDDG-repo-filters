import parse from '@/parse';
import compile from '@/compile';
import authors from './people.json';
import packsJson from './repo.json';
import { IPack } from '@/pack';

const packs = packsJson as IPack[];

const [validAuthor, validAuthorAlias, invalidAuthor, allAuthor] = compile(
	parse('author:Lunatic author:15laruea author:InvalidStuff 15laruea'),
	authors,
	packs
);

describe('filterparser/compile.ts/AuthorMatcher', () => {
	it('should be created from author matcher', () => {
		expect(validAuthor).toMatchInlineSnapshot(`
		AuthorMatcher {
		  "matchingAuthors": Set {
		    "Lunatic Rabbit",
		  },
		}
		`);
		expect(validAuthorAlias).toMatchInlineSnapshot(`
		AuthorMatcher {
		  "matchingAuthors": Set {
		    "Plural Roses",
		  },
		}
		`);
		expect(invalidAuthor).toMatchInlineSnapshot(`
		AuthorMatcher {
		  "matchingAuthors": Set {},
		}
		`);
		expect(allAuthor).toMatchInlineSnapshot(`
		AllMatcher {
		  "matchers": Array [
		    AuthorMatcher {
		      "matchingAuthors": Set {
		        "Plural Roses",
		      },
		    },
		  ],
		}
		`);
	});

	it('should return whether the match is impossible', () => {
		expect(validAuthor.isImpossible).toBeFalsy();
		expect(validAuthorAlias.isImpossible).toBeFalsy();
		expect(invalidAuthor.isImpossible).toBeTruthy();
		expect(allAuthor.isImpossible).toBeFalsy();
	});

	it('should properly match packs with the author', () => {
		expect(validAuthor.match(author1Pack)).toBeTruthy();
		expect(validAuthorAlias.match(author1Pack)).toBeFalsy();
		expect(invalidAuthor.match(author1Pack)).toBeFalsy();
		expect(allAuthor.match(author1Pack)).toBeFalsy();

		expect(validAuthor.match(author2Pack)).toBeFalsy();
		expect(validAuthorAlias.match(author2Pack)).toBeTruthy();
		expect(invalidAuthor.match(author2Pack)).toBeFalsy();
		expect(allAuthor.match(author2Pack)).toBeTruthy();
	});
});

const author1Pack: IPack = {
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

const author2Pack: IPack = {
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
