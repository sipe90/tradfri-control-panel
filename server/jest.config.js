module.exports = {
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json'
        }
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    moduleNameMapper: {
        '^#/(.*)$': '<rootDir>/src/$1',
    }
}