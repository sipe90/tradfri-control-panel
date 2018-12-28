module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.json'
        }
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/client/$1',
        '^#/(.*)$': '<rootDir>/src/server/$1',
        '^shared/(.*)$': '<rootDir>/src/shared/$1',
        '^test/(.*)$': '<rootDir>/test/$1'
    }
}