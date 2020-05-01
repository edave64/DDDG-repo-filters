import { IAuthors, IAuthor } from './authors';
import { IPack } from './pack';
import { Matcher } from './parse';

export interface CompiledMatcher {
	readonly isImpossible: boolean;
	match(pack: IPack): boolean;
}

interface MatcherCompiler {
	new (
		payload: string,
		peopleRepository: IAuthors,
		packRepository: IPack[]
	): CompiledMatcher;
}

class EngineMatcher implements CompiledMatcher {
	private static engines = [
		['Doki Doki Dialog Generator 1', 'dddg1Path'],
		['Doki Doki Dialouge Generator 1', 'dddg1Path'],
		['DDDG1', 'dddg1Path'],
		['Doki Doki Dialog Generator 2', 'dddg2Path'],
		['Doki Doki Dialouge Generator 2', 'dddg2Path'],
		['DDDG2', 'dddg2Path'],
		['Doki Doki Comic Club 2', 'ddcc2Path'],
		['DDCC2', 'ddcc2Path'],
	].map(([searchTerm, prop]) => [
		searchTerm.replace(/\s/g, '').toLowerCase(),
		prop,
	]) as [string, keyof IPack][];
	private readonly matchingProps: Readonly<Array<keyof IPack>>;

	public get isImpossible(): boolean {
		return this.matchingProps.length === 0;
	}

	constructor(payload: string) {
		payload = payload.replace(/[\s-]/g, '').toLowerCase();
		const matchingProps = new Set<keyof IPack>();
		for (const [searchText, key] of EngineMatcher.engines) {
			if (searchText.toLowerCase().indexOf(payload) >= 0) {
				matchingProps.add(key);
			}
		}
		this.matchingProps = Array.from(matchingProps);
	}

	match(pack: IPack): boolean {
		for (const matchingProp of this.matchingProps) {
			if (pack[matchingProp]) return true;
		}
		return false;
	}
}

class AuthorMatcher implements CompiledMatcher {
	private readonly matchingAuthors: Readonly<Set<string>>;

	public get isImpossible(): boolean {
		return this.matchingAuthors.size === 0;
	}

	public constructor(payload: string, peopleRepository: IAuthors) {
		payload = payload.toLowerCase();
		const matchingAuthors = new Set<string>();
		for (const authorKey in peopleRepository) {
			/* istanbul ignore next */
			if (!Object.prototype.hasOwnProperty.call(peopleRepository, authorKey))
				continue;
			const author = peopleRepository[authorKey]!;
			const props = Object.keys(author) as (keyof IAuthor)[];
			if (
				authorKey.toLowerCase().indexOf(payload) >= 0 ||
				props.find(prop => author[prop]!.toLowerCase().indexOf(payload) >= 0)
			) {
				matchingAuthors.add(authorKey);
			}
		}
		this.matchingAuthors = matchingAuthors;
	}

	public match(pack: IPack): boolean {
		return !!pack.authors.find(author => this.matchingAuthors.has(author));
	}
}

class CharacterMatcher implements CompiledMatcher {
	private static uniqueCharacters = new Map<Readonly<IPack[]>, string[]>();
	private readonly matchingCharacters: Readonly<Set<string>>;

	public get isImpossible(): boolean {
		return this.matchingCharacters.size === 0;
	}

	public constructor(
		payload: string,
		_peopleRepository: IAuthors,
		packRepository: IPack[]
	) {
		payload = payload.toLowerCase();
		this.matchingCharacters = new Set(
			CharacterMatcher.getUniqueCharacters(packRepository).filter(
				char => char.toLowerCase().indexOf(payload) >= 0
			)
		);
	}

	public match(pack: IPack): boolean {
		return !!pack.characters.find(character =>
			this.matchingCharacters.has(character)
		);
	}

	public static getUniqueCharacters(repo: Readonly<IPack[]>): string[] {
		let unique = this.uniqueCharacters.get(repo);
		if (!unique) {
			unique = Array.from(new Set(repo.flatMap(pack => pack.characters)));
			this.uniqueCharacters.set(repo, unique);
		}
		return unique;
	}
}

class TypeMatcher implements CompiledMatcher {
	private static types = [
		'Styles',
		'Characters',
		'Expressions',
		'Poses',
		'Misc',
	];
	private readonly matchingTypes: Readonly<Set<string>>;

	public get isImpossible(): boolean {
		return this.matchingTypes.size === 0;
	}

	public constructor(payload: string) {
		payload = payload.toLowerCase();
		this.matchingTypes = new Set(
			TypeMatcher.types.filter(type => type.toLowerCase().indexOf(payload) >= 0)
		);
	}

	public match(pack: IPack): boolean {
		return !!pack.kind.find(character => this.matchingTypes.has(character));
	}
}

class PackMatcher implements CompiledMatcher {
	private static tripletCache = new Map<Readonly<IPack[]>, Set<string>>();
	private readonly payload: string;
	public readonly isImpossible: boolean;

	public constructor(
		payload: string,
		_peopleRepository: IAuthors,
		packRepository: IPack[]
	) {
		payload = payload.toLowerCase();
		this.payload = payload;
		const triplets = PackMatcher.getTriplets(packRepository);
		for (let i = 0, length = payload.length - 2; i < length; ++i) {
			if (!triplets.has(payload.substr(i, 3))) {
				this.isImpossible = true;
				return;
			}
		}
		this.isImpossible = false;
	}

	public match(pack: IPack): boolean {
		if (this.isImpossible) return false;
		const payload = this.payload;
		return !!(
			pack.id.toLowerCase().indexOf(payload) >= 0 ||
			pack.name.toLowerCase().indexOf(payload) >= 0 ||
			pack.searchWords.find(word => word.toLowerCase().indexOf(payload) >= 0)
		);
	}

	public static getTriplets(repo: Readonly<IPack[]>): Set<string> {
		let triplets = this.tripletCache.get(repo);
		if (!triplets) {
			triplets = new Set();
			for (const pack of repo) {
				PackMatcher.splitTriplets(pack.id, triplets);
				PackMatcher.splitTriplets(pack.name, triplets);
				for (const word of pack.searchWords) {
					PackMatcher.splitTriplets(word, triplets);
				}
			}
			this.tripletCache.set(repo, triplets);
		}
		return triplets;
	}

	private static splitTriplets(str: string, cache: Set<string>): void {
		str = str.toLowerCase();
		for (let i = 0, length = str.length - 2; i < length; ++i) {
			cache.add(str.substr(i, 3));
		}
	}
}

class AllMatcher implements CompiledMatcher {
	private static allMatchers: MatcherCompiler[] = [
		EngineMatcher,
		AuthorMatcher,
		CharacterMatcher,
		TypeMatcher,
		PackMatcher,
	];

	private readonly matchers: Readonly<CompiledMatcher[]>;

	public constructor(
		payload: string,
		peopleRepository: IAuthors,
		packRepository: IPack[]
	) {
		this.matchers = AllMatcher.allMatchers
			.map(compiler => new compiler(payload, peopleRepository, packRepository))
			.filter(matcher => !matcher.isImpossible);
	}

	public get isImpossible(): boolean {
		return this.matchers.length === 0;
	}

	public match(pack: IPack): boolean {
		return !!this.matchers.find(matcher => matcher.match(pack));
	}
}

const CompilerMatch = new Map<Matcher['type'], MatcherCompiler>([
	['all', AllMatcher],
	['author', AuthorMatcher],
	['character', CharacterMatcher],
	['engine', EngineMatcher],
	['pack', PackMatcher],
	['type', TypeMatcher],
]);

export default function compile(
	matchers: Matcher[],
	authors: IAuthors,
	packs: IPack[]
): CompiledMatcher[] {
	return matchers.map(
		matcher =>
			new (CompilerMatch.get(matcher.type)!)(matcher.payload, authors, packs)
	);
}
