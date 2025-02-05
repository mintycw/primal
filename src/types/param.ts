export type RouteParams<T extends Record<string, string> = Record<string, string>> = {
	params: Promise<T>;
};
