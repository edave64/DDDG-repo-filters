export type PackKind =
	| 'Styles'
	| 'Characters'
	| 'Expressions'
	| 'Poses'
	| 'Misc';

export interface IPack {
	id: string;
	name: string;
	characters: string[];
	preview: string[];
	kind: PackKind[];
	source?: string;
	disclaimer?: string;
	description: string;
	dddg1Path: string;
	dddg2Path: string;
	ddcc2Path?: string;
	searchWords: string[];
	authors: string[];
}
