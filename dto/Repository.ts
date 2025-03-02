export type Repository = Record<
	'id' | 'stargazers_count' | 'forks_count',
	number
> &
	Record<'name' | 'html_url' | 'created_at' | 'language', string> &
	Record<'description', string | null>;
