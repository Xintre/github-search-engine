import Link from 'next/link';

export default function Users() {
	return (
		<div>
			<h3>This is users screen</h3>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{[1, 2, 3].map((user, index) => (
					<Link key={index} href={`/users/${user}`}>
						User {user}
					</Link>
				))}
			</div>
		</div>
	);
}
