'use client';

import { PropsWithChildren, useState } from 'react';
import { TokenContext, TokenContextType } from '@/context/TokenContext';

import { CookiesProvider } from 'react-cookie';
import { LoginForm } from '../LoginForm';

type ClientComponentWrapperProps = PropsWithChildren;

/**
 * This component uses the 'use client' directive (top of file) to render
 * client-side context providers so as not to throw an error from the server-side
 * rendered layout.tsx which does not support rendering client components there
 */
export function ClientComponentWrapper({
	children,
}: ClientComponentWrapperProps) {
	const [token, setToken] = useState<TokenContextType['token']>(null);

	return (
		<CookiesProvider>
			<TokenContext.Provider
				value={{
					token,
					setToken,
				}}
			>
				{token ? children : <LoginForm />}
			</TokenContext.Provider>
		</CookiesProvider>
	);
}
