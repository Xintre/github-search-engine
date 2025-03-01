import { AppHeader } from '@/components/AppHeader';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline } from '@mui/material';
import { Geist } from 'next/font/google';
import type { Metadata } from 'next';
import { TanstackQueryProvider } from '@/components/providers/TanstackQueryProvider';
import { ThemeProvider } from '@mui/material/styles';
import { TokenContextWrapper } from '@/components/providers/TokenContextWrapper';
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

							<AppHeader />

							<TokenContextWrapper>
								{children}
							</TokenContextWrapper>
						</ThemeProvider>
					</AppRouterCacheProvider>
				</TanstackQueryProvider>
			</body>
		</html>
	);
}
