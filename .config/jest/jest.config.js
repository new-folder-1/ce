module.exports = {
    testRegex: '\\.test\\.tsx?$',
    rootDir: '../../',
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ["<rootDir>/.config/jest/jest.setup.js"],
    snapshotSerializers: ["enzyme-to-json/serializer"],
    moduleNameMapper: {
        '\\.scss$': '<rootDir>/.config/jest/styleMock.js'
    }
};
