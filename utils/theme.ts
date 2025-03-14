'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	cssVariables: true,
	typography: {
		fontFamily: 'var(--font-geist-sans)',
	},
	palette: {
		mode: 'dark',
	},
});
