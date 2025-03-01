'use client';

import { Button, TextField } from '@mui/material';
import { useContext, useState } from 'react';

import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { TokenContext } from '@/app/context/TokenContext';

export type LoginFormProps = {};

export function LoginForm({}: LoginFormProps) {
	const [tokenBuffer, setTokenBuffer] = useState('');
	const { setToken } = useContext(TokenContext);

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
			<Divider variant="middle"></Divider>
			<TextField
				id="outlined-required"
				label="Token"
				variant="outlined"
				value={tokenBuffer}
				onChange={(event) => setTokenBuffer(event.target.value)}
			/>
			<Button
				type="submit"
				variant="contained"
				color="primary"
				onClick={() => setToken(tokenBuffer)}
				// disabled= check if token is proper
			>
				Sign In
			</Button>

			<Link href="/users">Users</Link>
		</div>
	);
}
