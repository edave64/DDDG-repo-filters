import type { IAuthors } from './authors.js';
import compile from './compile.js';
import optimize from './optimize.js';
import type { IPack } from './pack.js';
import parse from './parse.js';

export default function filter(
	search: string,
	authors: IAuthors,
	list: IPack[],
): IPack[] {
	const parsed = parse(search);
	const optimized = optimize(parsed);
	const compiled = compile(optimized, authors, list);
	if (compiled.find((matcher) => matcher.isImpossible)) return [];
	return list.filter((pack) =>
		compiled.every((matcher) => matcher.match(pack)),
	);
}
