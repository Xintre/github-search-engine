'use client';

import { PropsWithChildren, ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type TanstackQueryProviderProps = PropsWithChildren;

export function TanstackQueryProvider({
	children,
}: TanstackQueryProviderProps): ReactNode {
	const queryClient = useMemo(() => new QueryClient(), []);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
