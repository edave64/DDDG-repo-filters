import parser from '@/parse';

describe('filterparser/optimizer.ts', () => {
	it('should return one matcher per word', () => {
		const ret = parser('test tOAst');
		expect(ret).toHaveLength(2);
		expect(ret).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "test",
		    "type": "all",
		  },
		  Object {
		    "payload": "toast",
		    "type": "all",
		  },
		]
	`);
	});
	it('should ignore spaces', () => {
		const ret = parser('         tEst       toaSt     ');
		expect(ret).toHaveLength(2);
		expect(ret).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "test",
		    "type": "all",
		  },
		  Object {
		    "payload": "toast",
		    "type": "all",
		  },
		]
	`);
	});
	it('should recognize known prefixes', () => {
		const ret = parser('char:test ChArAcTer:toASt');
		expect(ret).toHaveLength(2);
		expect(ret).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "test",
		    "type": "character",
		  },
		  Object {
		    "payload": "toast",
		    "type": "character",
		  },
		]
	`);
	});
	it('should recognize abriviated prefixes', () => {
		const ret = parser('c:test chAR:toast');
		expect(ret).toHaveLength(2);
		expect(ret).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "test",
		    "type": "character",
		  },
		  Object {
		    "payload": "toast",
		    "type": "character",
		  },
		]
	`);
	});
	it('should recognize quotes', () => {
		const ret = parser('test "more then ONe word"');
		expect(ret).toHaveLength(2);
		expect(ret).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "test",
		    "type": "all",
		  },
		  Object {
		    "payload": "more then one word",
		    "type": "all",
		  },
		]
	`);
	});
	it('should recognize quotes after prefixes', () => {
		const ret = parser('c:test c:"more then one word" "c:not a prefix"');
		expect(ret).toHaveLength(3);
		expect(ret).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "test",
		    "type": "character",
		  },
		  Object {
		    "payload": "more then one word",
		    "type": "character",
		  },
		  Object {
		    "payload": "c:not a prefix",
		    "type": "all",
		  },
		]
	`);
	});
	it('should recognize allow spaces after prefix', () => {
		const ret = parser('fisch c: "still the same matcher"');
		expect(ret).toHaveLength(2);
		expect(ret).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "fisch",
		    "type": "all",
		  },
		  Object {
		    "payload": "still the same matcher",
		    "type": "character",
		  },
		]
	`);
	});
	it('should allow escape characters', () => {
		const ret = parser('fisch\\" with\\ space esc\\\\char');
		expect(ret).toHaveLength(3);
		expect(ret).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "payload": "fisch\\"",
		    "type": "all",
		  },
		  Object {
		    "payload": "with space",
		    "type": "all",
		  },
		  Object {
		    "payload": "esc\\\\char",
		    "type": "all",
		  },
		]
	`);
	});
});
