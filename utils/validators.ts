/**
 * Validates a GH access token
 * @param token the token to validate
 * @returns whether the token is valid
 */
export function validateToken(token: string): boolean {
	const githubTokenRegex =
		/gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{80,}/;

	return githubTokenRegex.test(token);
}
