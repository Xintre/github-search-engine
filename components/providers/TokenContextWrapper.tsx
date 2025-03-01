'use client';

import { PropsWithChildren, useState } from 'react';
import { TokenContext, TokenContextType } from '@/app/context/TokenContext';

import { LoginForm } from '../LoginForm';

type TokenContextWrapperProps = PropsWithChildren;

export function TokenContextWrapper({ children }: TokenContextWrapperProps) {
	const [token, setToken] = useState<TokenContextType['token']>(null);

	return (
		<TokenContext.Provider
			value={{
				token,
				setToken,
			}}
		>
			{token ? children : <LoginForm />}
		</TokenContext.Provider>
	);
}
