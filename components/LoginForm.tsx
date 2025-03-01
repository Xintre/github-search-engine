'use client';

import { Button, TextField } from '@mui/material';
import { useContext, useMemo, useState } from 'react';

import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { TokenContext } from '@/app/context/TokenContext';
import { validateToken } from '@/utils/validators';

export type LoginFormProps = {};

export function LoginForm({}: LoginFormProps) {
	const [tokenBuffer, setTokenBuffer] = useState('');
	const { setToken } = useContext(TokenContext);

	const isTokenValid = useMemo(() => {
		return validateToken(tokenBuffer);
	}, [tokenBuffer]);
	console.log('is token valid', isTokenValid);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
				alignItems: 'center',
				maxWidth: '350',
				margin: 'auto',
				padding: '20px',
			}}
		>
			<h2>Please pass the token 🔑</h2>

			<Divider variant="middle" />

			<TextField
				id="outlined-required"
				sx={{ width: 400 }}
				label="Token"
				variant="outlined"
				value={tokenBuffer}
				onChange={(event) => setTokenBuffer(event.target.value)}
				error={tokenBuffer && !isTokenValid}
				helperText={
					tokenBuffer && !isTokenValid
						? 'Please specify a valid token'
						: ''
				}
			/>

			<Button
				type="submit"
				variant="contained"
				color="primary"
				onClick={() => setToken(tokenBuffer)}
				disabled={!isTokenValid}
			>
				Sign In
			</Button>

			{/* <Link href="/users">Users</Link> */}
		</div>
	);
}
