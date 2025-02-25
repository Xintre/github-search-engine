export default async function UserRepositories({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;

	return (
		<div>
			<h3>Below are repositories of user {username}</h3>
		</div>
	);
}
