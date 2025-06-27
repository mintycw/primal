import redis from "../redis"; // Import the shared Redis connection instance

describe("Redis connection", () => {
	afterAll(() => {
		redis.disconnect(); // Ensure proper cleanup
	});

	it("should set and get a key successfully", async () => {
		const key = "jest-test-key";
		const value = "test-value";

		await redis.set(key, value);
		const result = await redis.get(key);

		expect(result).toBe(value);
	});
});
