import optimize, { deduplicateMatchers, sortByCost } from '@/optimize';
import { Matcher } from '@/parse';

describe('filterparser/optimizer.ts', () => {
	it('should deduplicate identical all matchers', () => {
		const result = deduplicateMatchers([
			{ type: 'all', payload: 'a' },
			{ type: 'all', payload: 'a' },
			{ type: 'all', payload: 'b' },
		]);

		expect(result.length).toBe(2);
		expect(
			result.find(r => r.type === 'all' && r.payload === 'a')
		).toBeTruthy();
		expect(
			result.find(r => r.type === 'all' && r.payload === 'b')
		).toBeTruthy();
	});
	it('should deduplicate identical matchers of the same kind', () => {
		const result = deduplicateMatchers([
			{ type: 'author', payload: 'a' },
			{ type: 'author', payload: 'a' },
			{ type: 'character', payload: 'a' },
			{ type: 'all', payload: 'b' },
			{ type: 'all', payload: 'b' },
		]);

		expect(result.length).toBe(3);
		expect(
			result.find(r => r.type === 'all' && r.payload === 'b')
		).toBeTruthy();
		expect(
			result.find(r => r.type === 'character' && r.payload === 'a')
		).toBeTruthy();
		expect(
			result.find(r => r.type === 'author' && r.payload === 'a')
		).toBeTruthy();
	});
	it('should deduplicate identical matchers of the same kind', () => {
		const result = deduplicateMatchers([
			{ type: 'author', payload: 'a' },
			{ type: 'author', payload: 'a' },
			{ type: 'character', payload: 'a' },
			{ type: 'all', payload: 'b' },
		]);

		expect(result.length).toBe(3);
		expect(
			result.find(r => r.type === 'all' && r.payload === 'b')
		).toBeTruthy();
		expect(
			result.find(r => r.type === 'character' && r.payload === 'a')
		).toBeTruthy();
		expect(
			result.find(r => r.type === 'author' && r.payload === 'a')
		).toBeTruthy();
	});
	it('should remove redundant matchers of the same kind', () => {
		const result = deduplicateMatchers([
			{ type: 'author', payload: 'a' },
			{ type: 'author', payload: 'and' },
			{ type: 'author', payload: 'drew' },
			{ type: 'author', payload: 'andrew' },
			{ type: 'character', payload: 'a' },
		]);

		expect(result.length).toBe(2);
		expect(
			result.find(r => r.type === 'author' && r.payload === 'andrew')
		).toBeTruthy();
		expect(
			result.find(r => r.type === 'character' && r.payload === 'a')
		).toBeTruthy();
	});
	it('should remove redundant "all" matchers', () => {
		const result = deduplicateMatchers([
			{ type: 'author', payload: 'a' },
			{ type: 'author', payload: 'and' },
			{ type: 'author', payload: 'dre' },
			{ type: 'author', payload: 'andrew' },
			{ type: 'character', payload: 'a' },
			{ type: 'all', payload: 'and' },
			{ type: 'all', payload: 'rew' },
			{ type: 'all', payload: 'dre' },
			{ type: 'all', payload: 'hand' },
		]);

		expect(result.length).toBe(3);
		expectMatcher(result, 'author', 'andrew');
		expectMatcher(result, 'character', 'a');
		expectMatcher(result, 'all', 'hand');
	});
	it('should sort matchers from least expensive/most specific to most expensive/least specific', () => {
		expect(
			sortByCost([
				{ type: 'all', payload: 'o' },
				{ type: 'all', payload: 'hand' },
				{ type: 'author', payload: 'andrew' },
				{ type: 'engine', payload: 'dddg1' },
			])
		).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "dddg1",
		    "type": "engine",
		  },
		  Object {
		    "payload": "andrew",
		    "type": "author",
		  },
		  Object {
		    "payload": "hand",
		    "type": "all",
		  },
		  Object {
		    "payload": "o",
		    "type": "all",
		  },
		]
	`);

		expect(
			sortByCost([
				{ type: 'all', payload: 'table' },
				{ type: 'all', payload: 'base' },
				{ type: 'all', payload: 'handle' },
				{ type: 'all', payload: 'apple' },
			])
		).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "handle",
		    "type": "all",
		  },
		  Object {
		    "payload": "table",
		    "type": "all",
		  },
		  Object {
		    "payload": "apple",
		    "type": "all",
		  },
		  Object {
		    "payload": "base",
		    "type": "all",
		  },
		]
	`);
	});
	it('optimize function should do both', () => {
		const result = optimize([
			{ type: 'all', payload: 'and' },
			{ type: 'all', payload: 'rew' },
			{ type: 'all', payload: 'dre' },
			{ type: 'all', payload: 'hand' },
			{ type: 'character', payload: 'a' },
			{ type: 'author', payload: 'a' },
			{ type: 'author', payload: 'and' },
			{ type: 'author', payload: 'dre' },
			{ type: 'author', payload: 'andrew' },
		]);
		expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "andrew",
		    "type": "author",
		  },
		  Object {
		    "payload": "a",
		    "type": "character",
		  },
		  Object {
		    "payload": "hand",
		    "type": "all",
		  },
		]
	`);
	});
});

function expectMatcher(
	matchers: Matcher[],
	type: Matcher['type'],
	payload: Matcher['payload']
) {
	expect(
		matchers.find(r => r.type === type && r.payload === payload)
	).toBeTruthy();
}
