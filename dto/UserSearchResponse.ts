import { SearchedUser } from './User';

export type UserSearchResponse = {
	total_count: number;
	incomplete_results: boolean;
	items: SearchedUser[];
};
