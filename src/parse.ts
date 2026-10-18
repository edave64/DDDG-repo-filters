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
	let inEscape = false;

	function finishWord(): void {
		matchers.push({
			type: (type as Matcher['type']) || 'all',
			payload: word.toLowerCase(),
		});
		word = '';
		type = '';
		inEscape = false;
		quote = false;
	}

	for (const char of str) {
		if (inEscape) {
			word += char;
			inEscape = false;
			continue;
		}
		switch (char) {
			case '\\':
				inEscape = true;
				continue;
			case ':': {
				const lowerWord = word.toLowerCase();
				if (!quote && type === '' && prefixLookup.has(lowerWord)) {
					type = prefixLookup.get(lowerWord)!;
					word = '';
					continue;
				}
				break;
			}
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
