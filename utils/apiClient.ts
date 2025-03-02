/**
 * Creates a URL to the API using the URI passed in
 * @param uri The URI to query for
 */
function makeURL(uri: string): string {
	return new URL(uri, 'https://api.github.com').toString();
}

export function getCommonHeaders(token: string): HeadersInit {
	return {
		'X-GitHub-Api-Version': '2022-11-28',
		Authorization: `token ${token}`,
	};
}

export type CreateBaseRequestOptions = {
	url: string;
	token: string;
};

export type FetchGetOptions = CreateBaseRequestOptions & {};

export async function fetchGET<T>({ token, url }: FetchGetOptions) {
	const response = await fetch(makeURL(url), {
		headers: getCommonHeaders(token),
	});

	return {
		statusCode: response.status,
		statusText: response.statusText,
		data: (await response.json()) as T,
	};
}
