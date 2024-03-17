module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  forceExit: true,
  setupFilesAfterEnv: ["jest-extended/all"],
};
