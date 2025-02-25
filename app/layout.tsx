import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { BackButton } from '@/components/BackButton';
import { Geist } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

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
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<div>
							<BackButton />
						</div>

						{children}
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
