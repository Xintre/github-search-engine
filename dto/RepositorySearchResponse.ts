import { Repository } from './Repository';

export type RepositorySearchResponse = {
	total_count: number;
	incomplete_results: boolean;
	items: Repository[];
};
