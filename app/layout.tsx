import { CssBaseline, Stack } from '@mui/material';

import { AppHeader } from '@/components/AppHeader';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ClientComponentWrapper } from '@/components/providers/ClientComponentWrapper';
import { Geist } from 'next/font/google';
import type { Metadata } from 'next';
import { TanstackQueryProvider } from '@/components/providers/TanstackQueryProvider';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/utils/theme';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Github Search Engine',
	description: 'A search engine for github users & their repos',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
			</head>

			<body className={geistSans.variable}>
				<TanstackQueryProvider>
					<AppRouterCacheProvider>
						<ThemeProvider theme={theme}>
							<CssBaseline />

							<ClientComponentWrapper>
								<AppHeader />

								<Stack gap={4} paddingTop={4} paddingBottom={4}>
									{children}
								</Stack>
							</ClientComponentWrapper>
						</ThemeProvider>
					</AppRouterCacheProvider>
				</TanstackQueryProvider>
			</body>
		</html>
	);
}
