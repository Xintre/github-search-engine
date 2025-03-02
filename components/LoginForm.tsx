'use client';

import {
	Button,
	CircularProgress,
	Container,
	TextField,
	Typography,
} from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';

import Divider from '@mui/material/Divider';
import { GH_API_TOKEN_COOKIE_NAME } from '@/utils/constants';
import { TokenContext } from '@/app/context/TokenContext';
import { useCookies } from 'react-cookie';
import { validateToken } from '@/utils/validators';

export type LoginFormProps = {};

export function LoginForm({}: LoginFormProps) {
	const [tokenBuffer, setTokenBuffer] = useState('');
	const { setToken } = useContext(TokenContext);
	const [loading, setLoading] = useState(true);

	const [cookies, setCookie] = useCookies([GH_API_TOKEN_COOKIE_NAME]);

	const isTokenValid = useMemo(
		() => validateToken(tokenBuffer),
		[tokenBuffer]
	);

	const showTokenError = useMemo(
		() => tokenBuffer.length != 0 && !isTokenValid,
		[isTokenValid, tokenBuffer.length]
	);

	useEffect(() => {
		const maybeTokenCookie = cookies[GH_API_TOKEN_COOKIE_NAME];

		if (maybeTokenCookie !== undefined) {
			setToken(maybeTokenCookie);
		}

		setLoading(false);
	}, [cookies, setToken]);

	return (
		<form
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
				alignItems: 'center',
				maxWidth: '350',
				margin: 'auto',
				padding: '20px',
				justifyContent: 'center',
			}}
			onSubmit={() => {
				if (isTokenValid) {
					setCookie(GH_API_TOKEN_COOKIE_NAME, tokenBuffer);

					setToken(tokenBuffer);
				}
			}}
		>
			{loading ? (
				<>
					<Typography>Checking cookie...</Typography>

					<CircularProgress size={40} />
				</>
			) : (
				<>
					<h2>Please pass the token 🔑</h2>

					<Container maxWidth="md">
						<Divider variant="middle" flexItem />
					</Container>

					<TextField
						id="outlined-required"
						sx={{ width: 400 }}
						label="Token"
						variant="outlined"
						value={tokenBuffer}
						onChange={(event) => setTokenBuffer(event.target.value)}
						error={showTokenError}
						helperText={
							showTokenError ? 'Please specify a valid token' : ''
						}
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						role="submit"
						disabled={!isTokenValid}
					>
						Sign In
					</Button>
				</>
			)}
		</form>
	);
}
