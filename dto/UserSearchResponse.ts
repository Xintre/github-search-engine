import { SearchedUser } from './SearchedUser';

export type UserSearchResponse = {
	total_count: number;
	incomplete_results: boolean;
	items: SearchedUser[];
};
