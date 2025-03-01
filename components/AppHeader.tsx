'use client';

import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

import { BackButton } from '@/components/BackButton';
import { Lock } from '@mui/icons-material';
import { TokenContext } from '@/app/context/TokenContext';
import { useContext } from 'react';

export type AppHeaderProps = {};

export function AppHeader({}: AppHeaderProps) {
	const { token, setToken } = useContext(TokenContext);

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
