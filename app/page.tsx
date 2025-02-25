'use client';

import Link from 'next/link';

export default function Home() {
	return (
		<div>
			<h3>This is home screen</h3>

			<Link href="/users">Users</Link>
		</div>
	);
}
