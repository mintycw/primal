// jest.config.ts
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
		"^@/components/(.*)$": "<rootDir>/components/$1",
		"^@/pages/(.*)$": "<rootDir>/pages/$1",
	},
};

export default createJestConfig(config);
