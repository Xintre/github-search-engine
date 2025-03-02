'use client';

import { Button, Container, Stack, TextField, Typography } from '@mui/material';
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
import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import { User } from '@/dto/User';
import { UserSearchResponse } from '@/dto/UserSearchResponse';
import _ from 'lodash';
import { fetchGET } from '@/utils/apiClient';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { useQuery } from '@tanstack/react-query';

const columns: GridColDef<User>[] = [
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
		renderCell: (params) => {
			// TODO move to repositories page

			return <Button onClick={() => {}}>repos</Button>;
		},
	},
];

export default function UsersScreen() {
	const [filter, setFilter] = useState('');
	const [filterBuffer, setFilterBuffer] = useState('');
	const [sortInfo, setSortInfo] = useState<GridSortModel[number] | null>(
		null
	);
	const [paginationInfo, setPaginationInfo] = useState<GridPaginationModel>({
		page: 0,
		pageSize: DATA_GRID_PAGE_SIZES[0],
	});

	const debouncedFilterChanged = useCallback(
		_.debounce((value: string) => {
			setFilter(value);
		}, 1000),
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
			],
			gcTime: TEST_DISABLE_USEQUERY_CACHING ? 0 : undefined,
			queryFn: async () => {
				const urlSearchParams = new URLSearchParams();

				urlSearchParams.append('q', filter.length === 0 ? 'a' : filter);

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
					label="user name"
					variant="outlined"
					value={filterBuffer}
					onChange={(event) => {
						setFilterBuffer(event.target.value);
						debouncedFilterChanged(event.target.value);
					}}
				/>

				<span>
					Data last updated at{' '}
					{isFetched
						? moment(dataUpdatedAt).format('HH:mm:ss')
						: '---'}
				</span>
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
				columns={columns}
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
