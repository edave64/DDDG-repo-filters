export interface IAuthors {
	[id: string]: IAuthor | undefined;
}

export interface IAuthor {
	currentName?: string;
	deviantart?: string;
	reddit?: string;
	twitter?: string;
	pixiv?: string;
	website?: string;
	discord?: string;
	facebook?: string;
	github?: string;
	patreon?: string;
}
