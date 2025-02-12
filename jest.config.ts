import type { Config } from "@jest/types";
import nextJest from "next/jest";

const createJestConfig = nextJest({
	dir: "./",
});

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
};

export default createJestConfig(config);
