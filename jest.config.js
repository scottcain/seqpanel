/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testPathIgnorePatterns: ["/dist/"],
  testEnvironment: "jsdom",
};
