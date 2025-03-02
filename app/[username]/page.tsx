'use client';

import {
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	Divider,
	Link,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material';
import {
	DATA_GRID_PAGE_SIZES,
	TEST_DISABLE_USEQUERY_CACHING,
} from '@/utils/constants';
import { use, useContext } from 'react';

import { CollectionsBookmark } from '@mui/icons-material';
import { OpenGHProfileButton } from '@/components/OpenGHProfileButton';
import { TokenContext } from '@/context/TokenContext';
import { User } from '@/dto/User';
import { fetchGET } from '@/utils/apiClient';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';

export default function UserDetailsAndRepos({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = use(params);

	const { token } = useContext(TokenContext);

	const {
		isError: isUserError,
		error: userError,
		isLoading: isLoadingUser,
		data: user,
	} = useQuery({
		queryKey: ['single_user', username],
		gcTime: TEST_DISABLE_USEQUERY_CACHING ? 0 : undefined,
		queryFn: async () => {
			const response = await fetchGET<User>({
				url: `/users/${username}`,
				token: token!,
			});

			// notify useQuery that we failed
			if (response.statusCode !== 200) {
				throw new Error(
					`${response.statusCode} ${response.statusText}`
				);
			}

			return response.data;
		},
	});

	return (
		<Stack justifyContent="center" direction="row">
			{isUserError ? (
				<Typography variant="h6" color="error">
					{userError.message}
				</Typography>
			) : (
				<Card sx={{ maxWidth: 345 }}>
					<CardActionArea
						onClick={() => {
							window.open(
								user?.html_url,
								'_blank',
								'noopener noreferrer'
							);
						}}
					>
						{isLoadingUser ? (
							<Skeleton
								animation="wave"
								variant="circular"
								width={40}
								height={40}
							/>
						) : (
							<CardMedia
								component="img"
								image={user?.avatar_url}
							/>
						)}
					</CardActionArea>

					<CardContent component={Stack} gap={1}>
						<Typography gutterBottom variant="h5" component="div">
							{user ? `${user.name} (${user.login})` : username}
						</Typography>

						<Link
							href={user?.blog === '' ? undefined : user?.blog}
							target="_blank"
							rel="noopener noreferrer"
						>
							{user?.blog === ''
								? 'No blog provided'
								: user?.blog}
						</Link>

						<Divider sx={{ mt: 1, mb: 2 }} />

						<Stack
							justifyContent="space-evenly"
							alignItems="flex-start"
							direction="row"
							flexWrap="wrap"
							rowGap={2}
						>
							<Chip
								icon={<CollectionsBookmark />}
								onClick={() => {
									const urlSearchParams =
										new URLSearchParams();

									urlSearchParams.append(
										'tab',
										'repositories'
									);

									window.open(
										`${user?.html_url}?${urlSearchParams.toString()}`,
										'_blank',
										'noopener noreferrer'
									);
								}}
								label={`${user?.public_repos} repositories`}
							/>

							<Chip
								icon={<CollectionsBookmark />}
								label={`${user?.following} followers`}
							/>

							<Chip
								icon={<CollectionsBookmark />}
								label={`${user?.following} following`}
							/>

							<Chip
								icon={<CollectionsBookmark />}
								label={`Member since ${moment(user?.created_at).format('MMM YYYY')}`}
							/>
						</Stack>

						<Divider sx={{ mt: 1.5, mb: 1 }} />

						<Typography
							variant="body1"
							sx={{ color: 'text.secondary' }}
						>
							{user?.bio ?? 'No bio provided'}
						</Typography>
					</CardContent>

					<Divider sx={{ mt: 1.5, mb: 1 }} />

					<CardActions>
						<OpenGHProfileButton
							link={user?.html_url ?? undefined}
						/>
					</CardActions>
				</Card>
			)}
		</Stack>
	);
}
