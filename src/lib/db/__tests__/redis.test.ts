import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT) || undefined;
const REDIS_PASS = process.env.REDIS_PASS;

const redis = new Redis({
	host: REDIS_HOST,
	port: REDIS_PORT,
	password: REDIS_PASS,
	maxRetriesPerRequest: 2,
});

describe("Redis connection", () => {
	afterAll(() => {
		redis.disconnect();
	});

	it("should set and get a key successfully", async () => {
		const key = "jest-test-key";
		const value = "test-value";

		await redis.set(key, value);
		const result = await redis.get(key);

		expect(result).toBe(value);
	});
});
