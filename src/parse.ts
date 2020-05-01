export interface Matcher {
	type: 'all' | 'author' | 'character' | 'type' | 'pack' | 'engine';
	payload: string;
}

const availablePrefixes = ['author', 'character', 'type', 'pack', 'engine'];
const prefixLookup: Map<string, string> = new Map();

for (const prefix of availablePrefixes) {
	for (let i = 1; i <= prefix.length; ++i) {
		const short = prefix.slice(0, i);
		prefixLookup.set(short, prefix);
	}
}

const spaceMatcher = /\s/;

export default function parseSearchwords(str: string): Matcher[] {
	const matchers = [] as Matcher[];
	let word = '';
	let type = '';
	let quote = false;
	let escape = false;

	function finishWord(): void {
		matchers.push({
			type: (type as Matcher['type']) || 'all',
			payload: word.toLowerCase(),
		});
		word = '';
		type = '';
		escape = false;
		quote = false;
	}

	for (const char of str) {
		if (escape) {
			word += char;
			escape = false;
			continue;
		}
		switch (char) {
			case '\\':
				escape = true;
				continue;
			case ':':
				// eslint-disable-next-line no-case-declarations
				const lowerWord = word.toLowerCase();
				if (!quote && type === '' && prefixLookup.has(lowerWord)) {
					type = prefixLookup.get(lowerWord)!;
					word = '';
					continue;
				}
				break;
			case '"':
				if (quote) {
					finishWord();
				} else {
					quote = true;
				}
				continue;
		}
		if (!quote && spaceMatcher.test(char)) {
			if (word) {
				finishWord();
			}
		} else {
			word += char;
		}
	}
	if (word) finishWord();
	return matchers;
}
