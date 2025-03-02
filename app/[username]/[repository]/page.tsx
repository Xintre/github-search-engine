'use client';

import { use } from 'react';

export default function RepositoryDetailsScreen({
	params,
}: {
	params: Promise<{ username: string; repository: string }>;
}) {
	const { repository, username } = use(params);

	return <></>;
}
