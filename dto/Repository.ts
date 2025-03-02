export type Repository = Record<'id', number> &
	Record<'name' | 'html_url' | 'created_at' | 'language', string> &
	Record<'description', string | null>;
