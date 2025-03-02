import { createContext } from 'react';

export type TokenContextType = {
	token: null | string;
	setToken: (token: null | string) => void;
};

export const defaultValue: TokenContextType = {
	token: null,
	setToken: () => {},
};

export const TokenContext = createContext<TokenContextType>(defaultValue);
