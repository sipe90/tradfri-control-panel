const { injectBabelPlugin } = require('react-app-rewired')

module.exports = {
    webpack: (config /*, env*/ ) => {
        config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], config)
        return config
    },
    jest: (config) => {
        if (!config.testMatch) {
            config.testMatch = []
        }
        config.testMatch.push('<rootDir>/test/**/?(*.)(spec|test).{js,jsx,mjs}')
        return config
    }
}
