export type RouteParams<T extends Record<string, string> = Record<string, string>> = {
	params: Promise<T>;
};

export type ResolvedRouteParams<T extends Record<string, string> = Record<string, string>> = {
	params: Awaited<T>; // to extract the resolved type of the Promise
};
