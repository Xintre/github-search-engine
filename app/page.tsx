'use client';

import { AccountCircle, CorporateFare, Workspaces } from '@mui/icons-material';
import {
	Button,
	Container,
	Stack,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	DATA_GRID_PAGE_SIZES,
	TEST_DISABLE_USEQUERY_CACHING,
} from '@/utils/constants';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { OpenGHProfileButton } from '@/components/OpenGHProfileButton';
import { ProfileTypeFilter } from './ProfileTypeFilter';
import { SearchedUser } from '@/dto/SearchedUser';
import { TokenContext } from '@/context/TokenContext';
import { UserSearchResponse } from '@/dto/UserSearchResponse';
import _ from 'lodash';
import { fetchGET } from '@/utils/apiClient';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const gridColumnsDefFactory: (
	router: ReturnType<typeof useRouter>
) => GridColDef<SearchedUser>[] = (router) => [
	{
		field: 'avatar_url',
		headerName: 'Avatar',
		sortable: false,
		width: 150,
		renderCell: (params) => (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					height: '100%',
				}}
			>
				<Image
					src={params.value}
					alt="Avatar"
					width={40}
					height={40}
					style={{
						borderRadius: '50%',
					}}
				/>
			</div>
		),
	},
	{
		field: 'id',
		headerName: 'ID',
		sortable: false,
	},
	{
		field: 'login',
		headerName: 'Login',
		sortable: false,
		width: 400,
	},
	{
		field: 'type',
		headerName: 'Type',
		sortable: false,
		width: 100,
	},
	{
		field: 'usersCard',
		headerName: `Go to user's card`,
		sortable: false,
		width: 150,
		renderCell: (params) => (
			<Button
				onClick={() => {
					router.push(params.row.login);
				}}
			>
				card
			</Button>
		),
	},
	{
		field: 'html_url',
		headerName: 'Go to profile',
		sortable: false,
		width: 150,
		renderCell: (params) => (
			<OpenGHProfileButton link={params.row.html_url} />
		),
	},
	{
		field: 'score',
		headerName: 'Score',
		sortable: false,
		width: 100,
	},
];

const PROFILE_TYPE_OPTIONS: {
	Icon: typeof AccountCircle;
	value: ProfileTypeFilter;
	tooltip: string;
}[] = [
	{
		Icon: AccountCircle,
		value: ProfileTypeFilter.USERS,
		tooltip: 'Users only',
	},
	{
		Icon: CorporateFare,
		value: ProfileTypeFilter.ORGANIZATIONS,
		tooltip: 'Organizations only',
	},
	{
		Icon: Workspaces,
		value: ProfileTypeFilter.ALL,
		tooltip: 'All (both users and organizations)',
	},
];

export default function UsersScreen() {
	const [filter, setFilter] = useState('');
	const [filterBuffer, setFilterBuffer] = useState('');
	const [totalCount, setTotalCount] = useState(0);
	const [profileTypeFilter, setProfileTypeFilter] =
		useState<ProfileTypeFilter>(ProfileTypeFilter.ALL);
	const [paginationInfo, setPaginationInfo] = useState<GridPaginationModel>({
		page: 0,
		pageSize: DATA_GRID_PAGE_SIZES[0],
	});
	const router = useRouter();
	const columnsDef = useMemo(() => gridColumnsDefFactory(router), [router]);

	const { token } = useContext(TokenContext);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedFilterChanged = useCallback(
		_.debounce((value: string) => {
			setFilter(value);
		}, 220),
		[]
	);

	const { isError, error, isLoading, data, dataUpdatedAt, isFetched } =
		useQuery({
			queryKey: [
				'users',
				filter,
				paginationInfo.page,
				paginationInfo.pageSize,
				profileTypeFilter,
			],
			gcTime: TEST_DISABLE_USEQUERY_CACHING ? 0 : undefined,
			queryFn: async () => {
				const urlSearchParams = new URLSearchParams();

				// query & type filter
				urlSearchParams.append(
					'q',
					[
						// user query filter
						filter.length === 0
							? // by default if no query is present, show users starting with 'a'
								'a'
							: filter,

						// type filter
						profileTypeFilter === ProfileTypeFilter.ALL
							? null // if all, then don't set this filter
							: `type:${profileTypeFilter}`,
					]
						.filter((x) => !!x)
						.join(' ')
				);

				// pagination
				urlSearchParams.append(
					'page',
					(paginationInfo.page + 1).toString()
				);
				urlSearchParams.append(
					'per_page',
					paginationInfo.pageSize.toString()
				);

				const response = await fetchGET<UserSearchResponse>({
					url: `search/users?${urlSearchParams.toString()}`,
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

				return response.data;
			},
		});

	// log data fetching error to console effect
	useEffect(() => {
		if (!error) return;

		console.error('Error fetching data', error);
	}, [error]);

	return (
		<Container style={{ width: '80%' }}>
			<Stack
				direction="row"
				justifyContent="space-evenly"
				alignItems="center"
			>
				<h2>Search for a user 🔎</h2>

				<TextField
					id="outlined-required"
					sx={{ width: 400 }}
					label="Filter results (username, login, email, etc.)"
					variant="outlined"
					value={filterBuffer}
					onChange={(event) => {
						const newValue = event.target.value
							// replace type:... with empty string - this is
							// controlled this separately via toggle buttons
							.replace(/type:\S*/g, '');

						setFilterBuffer(newValue);
						debouncedFilterChanged(newValue);
					}}
				/>

				<ToggleButtonGroup
					value={profileTypeFilter}
					exclusive
					onChange={(_event, value) => {
						setProfileTypeFilter(value);
					}}
				>
					{PROFILE_TYPE_OPTIONS.map(
						({ value, Icon, tooltip }, index) => (
							<Tooltip key={index} title={tooltip} arrow>
								<ToggleButton value={value}>
									<Icon />
								</ToggleButton>
							</Tooltip>
						)
					)}
				</ToggleButtonGroup>

				<Typography variant="subtitle1">
					Data last updated at{' '}
					{isFetched
						? moment(dataUpdatedAt).format('HH:mm:ss')
						: '---'}
				</Typography>
			</Stack>

			{(isError || isLoading) && (
				<Typography
					variant="h2"
					style={{
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{isError ? 'Error loading data!' : 'Loading data...'}
				</Typography>
			)}

			<DataGrid
				rows={data?.items}
				rowCount={totalCount}
				columns={columnsDef}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: DATA_GRID_PAGE_SIZES[1],
						},
					},
				}}
				pageSizeOptions={DATA_GRID_PAGE_SIZES}
				paginationMode="server"
				onPaginationModelChange={setPaginationInfo}
				loading={isLoading}
			/>
		</Container>
	);
}
