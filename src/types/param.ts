export type RouteParams<
	T extends Record<string, string | number | boolean> = Record<string, string | number | boolean>,
> = {
	params: T;
};
