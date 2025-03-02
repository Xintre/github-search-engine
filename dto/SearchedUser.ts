export type SearchedUser = {
	id: number;
	score: number;
} & Record<'login' | 'avatar_url' | 'html_url' | 'type', string>;
