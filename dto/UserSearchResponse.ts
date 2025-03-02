import { User } from './User';

export type UserSearchResponse = {
	total_count: number;
	incomplete_results: boolean;
	items: User[];
};
