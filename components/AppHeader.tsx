'use client';

import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

import { BackButton } from '@/components/BackButton';
import { GH_API_TOKEN_COOKIE_NAME } from '@/utils/constants';
import { Lock } from '@mui/icons-material';
import { TokenContext } from '@/context/TokenContext';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';

export type AppHeaderProps = {};

export function AppHeader({}: AppHeaderProps) {
	const { token, setToken } = useContext(TokenContext);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_cookies, _setCookie, removeCookie] = useCookies([
		GH_API_TOKEN_COOKIE_NAME,
	]);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar
					sx={{
						justifyContent: 'space-between',
					}}
				>
					<BackButton />

					<Typography variant="h6">
						Xintre&apos;s Github Search Engine
					</Typography>

					{token ? (
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
							onClick={() => {
								setToken(null);
								removeCookie(GH_API_TOKEN_COOKIE_NAME);
							}}
						>
							<Lock />
						</IconButton>
					) : (
						<div />
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
