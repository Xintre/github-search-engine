export type User = Record<
	'id' | 'public_repos' | 'public_gists' | 'followers' | 'following',
	number
> &
	Record<
		| 'created_at'
		| 'name'
		| 'login'
		| 'avatar_url'
		| 'html_url'
		| 'type'
		| 'blog',
		string
	> &
	Record<'location' | 'email' | 'bio', string | null>;
