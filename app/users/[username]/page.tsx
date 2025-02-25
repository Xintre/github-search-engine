import Link from 'next/link';

export default async function UserDetails({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;

	return (
		<div>
			<h3>Hello, these are details for user: {username}</h3>

			<Link href="/">Go home</Link>
		</div>
	);
}
