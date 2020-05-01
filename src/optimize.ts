import { Matcher } from './parse';

const matchCost: Map<Matcher['type'], number> = new Map([
	// static property equals
	['engine', 0],
	// search on pack properties
	['pack', 1],
	// find in array
	['type', 2],
	['character', 2],
	['author', 2],
	// mayhem
	['all', 3],
]);

export default function optimize(matchers: Matcher[]): Matcher[] {
	return sortByCost(deduplicateMatchers(matchers));
}

export function sortByCost(matchers: Matcher[]): Matcher[] {
	return matchers.sort(
		(a, b) =>
			matchCost.get(a.type)! - matchCost.get(b.type)! ||
			b.payload.length - a.payload.length
	);
}

/**
 * @private
 */
export function deduplicateMatchers(matchers: Matcher[]): Matcher[] {
	const splitByType = new Map<string, Matcher[]>();

	for (const matcher of matchers) {
		let list = splitByType.get(matcher.type);
		if (!list) {
			list = [];
			splitByType.set(matcher.type, list);
		}
		list.push(matcher);
	}

	for (const key of splitByType.keys()) {
		const value = splitByType.get(key)!;
		const quickDeprefix = value
			.sort((a, b) => a.payload.localeCompare(b.payload))
			.filter((matcher, idx, ary) => {
				if (!ary[idx + 1]) return true;
				return !ary[idx + 1].payload.startsWith(matcher.payload);
			});
		splitByType.set(
			key,
			quickDeprefix.filter((matcher, idx, ary) => {
				return !ary.find(
					(collision, collIdx) =>
						collIdx !== idx && collision.payload.indexOf(matcher.payload) !== -1
				);
			})
		);
	}

	const specializedTypes = Array.from(splitByType.keys()).filter(
		type => type !== 'all'
	);

	splitByType.set(
		'all',
		(splitByType.get('all') || []).filter(matcher => {
			return !specializedTypes.find(typeKey =>
				splitByType
					.get(typeKey)!
					.find(
						competingMatcher =>
							competingMatcher.payload.indexOf(matcher.payload) !== -1
					)
			);
		})
	);

	return [...splitByType.values()].flatMap(x => x);
}
