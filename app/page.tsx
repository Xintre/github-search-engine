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
	GH_API_TOKEN_COOKIE_NAME,
	TEST_DISABLE_USEQUERY_CACHING,
} from '@/utils/constants';
import {
	DataGrid,
	GridColDef,
	GridPaginationModel,
	GridSortModel,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { ProfileTypeFilter } from './ProfileTypeFilter';
import { User } from '@/dto/User';
import { UserSearchResponse } from '@/dto/UserSearchResponse';
import _ from 'lodash';
import { fetchGET } from '@/utils/apiClient';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const gridColumnsDefFactory: (
	router: ReturnType<typeof useRouter>
) => GridColDef<User>[] = (router) => [
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
	},
	{
		field: 'login',
		headerName: 'Login',
		sortable: true,
		width: 400,
	},
	{
		field: 'repos',
		headerName: 'Go to repositories',
		sortable: false,
		width: 300,
		renderCell: (params) => (
			<Button
				onClick={() => {
					router.push(params.row.login);
				}}
			>
				repos
			</Button>
		),
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
		Icon: Workspaces,
		value: ProfileTypeFilter.ALL,
		tooltip: 'All (both users and organizations)',
	},
	{
		Icon: CorporateFare,
		value: ProfileTypeFilter.ORGANIZATIONS,
		tooltip: 'Organizations only',
	},
];

export default function UsersScreen() {
	const [filter, setFilter] = useState('');
	const [filterBuffer, setFilterBuffer] = useState('');
	const [profileTypeFilter, setProfileTypeFilter] =
		useState<ProfileTypeFilter>(ProfileTypeFilter.ALL);
	const [sortInfo, setSortInfo] = useState<GridSortModel[number] | null>(
		null
	);
	const [paginationInfo, setPaginationInfo] = useState<GridPaginationModel>({
		page: 0,
		pageSize: DATA_GRID_PAGE_SIZES[0],
	});
	const router = useRouter();
	const columnsDef = useMemo(() => gridColumnsDefFactory(router), [router]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedFilterChanged = useCallback(
		_.debounce((value: string) => {
			setFilter(value);
		}, 220),
		[]
	);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [cookies, _setCookie, _removeCookie] = useCookies([
		GH_API_TOKEN_COOKIE_NAME,
	]);
	const token = cookies[GH_API_TOKEN_COOKIE_NAME];

	const { isError, error, isLoading, data, dataUpdatedAt, isFetched } =
		useQuery({
			queryKey: [
				'users',
				filter,
				sortInfo?.field,
				sortInfo?.sort,
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
						// user query
						filter.length === 0
							? // by default if no query is present, show users starting with 'a'
								'a'
							: filter,
						// type
						profileTypeFilter === ProfileTypeFilter.ALL
							? null // if all, then don't set this filter
							: `type:${profileTypeFilter}`,
					]
						.filter((x) => x !== null)
						.join(' ')
				);

				// pagination
				urlSearchParams.append('page', paginationInfo.page.toString());
				urlSearchParams.append(
					'per_page',
					paginationInfo.pageSize.toString()
				);

				const response = await fetchGET<UserSearchResponse>({
					url: `search/users?${urlSearchParams.toString()}`,
					token,
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

	const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
		setSortInfo(sortModel.length ? sortModel[0] : null);
	}, []);

	const handlePaginationModelChange = useCallback(
		(paginationModel: GridPaginationModel) => {
			setPaginationInfo(paginationModel);
		},
		[]
	);

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
				rowCount={data?.total_count ?? 0}
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
				onPaginationModelChange={handlePaginationModelChange}
				loading={isLoading}
				sortingMode="server"
				onSortModelChange={handleSortModelChange}
			/>
		</Container>
	);
}
