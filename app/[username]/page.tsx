'use client';

import {
	CalendarMonth,
	CollectionsBookmark,
	Groups,
	RunCircle,
} from '@mui/icons-material';
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
import {
	DataGrid,
	GridColDef,
	GridPaginationModel,
	GridSortModel,
} from '@mui/x-data-grid';
import {
	use,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

import { OpenGHProfileButton } from '@/components/OpenGHProfileButton';
import { Repository } from '@/dto/Repository';
import { RepositorySearchResponse } from '@/dto/RepositorySearchResponse';
import { TokenContext } from '@/context/TokenContext';
import { User } from '@/dto/User';
import { fetchGET } from '@/utils/apiClient';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const gridColumnsDefFactory: (
	router: ReturnType<typeof useRouter>
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
) => GridColDef<Repository>[] = (_router) => [
	{
		field: 'name',
		headerName: `Repo's name`,
		sortable: false,
		width: 250,
	},
	{
		field: 'id',
		headerName: 'ID',
		sortable: false,
	},
	{
		field: 'description',
		headerName: 'Description',
		sortable: false,
		width: 450,
		valueFormatter: (params) => {
			return params === null ? 'No description provided' : params;
		},
	},
	{
		field: 'created_at',
		headerName: 'Created at',
		sortable: false,
		width: 100,
		valueFormatter: (params) => moment(params).format('MMM YYYY'),
	},
	{
		field: 'language',
		headerName: 'Language',
		sortable: false,
		width: 150,
		valueFormatter: (params) => {
			return params === null ? 'No language info' : params;
		},
	},
	{
		field: 'stargazers_count',
		headerName: 'Stars',
		sortable: true,
	},
	{
		field: 'forks_count',
		headerName: 'Forks',
		sortable: true,
	},
	{
		field: 'html_url',
		headerName: 'Go to repo',
		sortable: false,
		width: 100,
		renderCell: (params) => (
			<OpenGHProfileButton link={params.row.html_url} />
		),
	},
];
export default function UserDetailsAndRepos({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = use(params);
	const { token } = useContext(TokenContext);
	const [totalCount, setTotalCount] = useState(0);
	const [sortInfo, setSortInfo] = useState<GridSortModel[number] | null>(
		null
	);

	const router = useRouter();
	const columnsDef = useMemo(() => gridColumnsDefFactory(router), [router]);

	const [paginationInfo, setPaginationInfo] = useState<GridPaginationModel>({
		page: 0,
		pageSize: DATA_GRID_PAGE_SIZES[0],
	});

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

	const {
		isError: isRepositoriesError,
		error: repositoriesError,
		isLoading: isLoadingRepositories,
		data: repositoriesData,
	} = useQuery({
		queryKey: [
			'repositories',
			paginationInfo.page,
			paginationInfo.pageSize,
			sortInfo?.field,
			sortInfo?.sort,
		],
		gcTime: TEST_DISABLE_USEQUERY_CACHING ? 0 : undefined,
		queryFn: async () => {
			const urlSearchParams = new URLSearchParams();

			// only of the given user's
			urlSearchParams.append('q', `user:${username}`);

			// pagination
			urlSearchParams.append(
				'page',
				(paginationInfo.page + 1).toString()
			);
			urlSearchParams.append(
				'per_page',
				paginationInfo.pageSize.toString()
			);

			// sorting
			if (sortInfo && sortInfo.sort) {
				// the mapping of sorting fields is different than response fields:
				// https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories:~:text=Parameters%20for%20%22Search%20repositories%22
				const sortField =
					sortInfo.field === 'forks_count' ? 'forks' : 'stars';

				urlSearchParams.append('sort', sortField);
				urlSearchParams.append('order', sortInfo.sort);
			}

			const response = await fetchGET<RepositorySearchResponse>({
				url: `/search/repositories?${urlSearchParams.toString()}`,
				token: token!,
			});

			// notify useQuery that we failed
			if (response.statusCode !== 200) {
				throw new Error(
					`${response.statusCode} ${response.statusText}`
				);
			}

			// store the total count in a separate state var so when
			// the data is being fetched again on page change, MUI
			// does not receive 0 total items for a while which
			// would case it to reset the page to 0 as well
			setTotalCount(response.data.total_count);

			return response.data.items;
		},
	});

	const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
		setSortInfo(sortModel.length ? sortModel[0] : null);
	}, []);

	// log user data fetching error to console effect
	useEffect(() => {
		if (!userError) return;

		console.error('Error fetching user data', userError);
	}, [userError]);

	// log repository data fetching error to console effect
	useEffect(() => {
		if (!repositoriesError) return;

		console.error('Error fetching repositories data', repositoriesError);
	}, [repositoriesError]);

	return (
		<Stack
			justifyContent="center"
			direction="row"
			alignContent={'space-between'}
			gap={5}
			marginLeft={10}
			marginRight={10}
		>
			{isUserError ? (
				<Typography variant="h6" color="error">
					{userError.message}
				</Typography>
			) : (
				<>
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
							<Typography
								gutterBottom
								variant="h5"
								component="div"
							>
								{user
									? `${user.name} (${user.login})`
									: username}
							</Typography>

							<Link
								href={
									user?.blog === '' ? undefined : user?.blog
								}
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
									sx={{
										backgroundColor: '#24272B',
										color: 'white',
									}}
								/>

								<Chip
									icon={<Groups />}
									label={`${user?.followers} followers`}
									sx={{
										backgroundColor: '#197278',
										color: 'white',
									}}
								/>

								<Chip
									icon={<RunCircle />}
									label={`${user?.following} following`}
									sx={{
										backgroundColor: '#4B644A',
										color: '#0F0326',
									}}
								/>

								<Chip
									icon={<CalendarMonth />}
									label={`Member since ${moment(user?.created_at).format('MMM YYYY')}`}
									sx={{
										backgroundColor: '#57467B',
										color: 'white',
									}}
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

					{isRepositoriesError ? (
						<Typography variant="h3" color="error">
							Error fetching repositories data:{' '}
							{repositoriesError.message}
						</Typography>
					) : (
						<DataGrid
							rows={repositoriesData}
							rowCount={totalCount}
							columns={columnsDef}
							initialState={{
								pagination: {
									paginationModel: {
										pageSize: DATA_GRID_PAGE_SIZES[0],
									},
								},
							}}
							pageSizeOptions={DATA_GRID_PAGE_SIZES}
							paginationMode="server"
							onPaginationModelChange={setPaginationInfo}
							loading={isLoadingRepositories}
							sortingMode="server"
							onSortModelChange={handleSortModelChange}
						/>
					)}
				</>
			)}
		</Stack>
	);
}
