module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: ['src/controllers/*.ts', 'src/routes/*.ts', 'src/config/*.ts', 'src/models/*.ts'],
  testEnvironment: 'node',
};