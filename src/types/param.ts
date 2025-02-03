export type RouteParams<T extends Record<string, string> = Record<string, string>> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	params: Promise<T> | undefined | any;
};

export type ResolvedRouteParams<T extends Record<string, string> = Record<string, string>> = {
	params: Awaited<T>; // to extract the resolved type of the Promise
};
