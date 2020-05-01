import parse from './parse';
import optimize from './optimize';
import compile from './compile';
import { IAuthors } from './authors';
import { IPack } from './pack';

export default function filter(
	search: string,
	authors: IAuthors,
	list: IPack[]
): IPack[] {
	const parsed = parse(search);
	const optimized = optimize(parsed);
	const compiled = compile(optimized, authors, list);
	if (compiled.find(matcher => matcher.isImpossible)) return [];
	return list.filter(pack => compiled.every(matcher => matcher.match(pack)));
}
