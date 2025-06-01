import type { Config } from "@jest/types";
import nextJest from "next/jest";

const createJestConfig = nextJest({
	dir: "./",
});

const config: Config.InitialOptions = {
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
	},
	transformIgnorePatterns: ["/node_modules/(?!(next-intl)/)"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
