// Absolute path to your package
const packagePath = '../../common-library';

module.exports = {
    resolver: {
        nodeModulesPaths: [packagePath],
    },
    watchFolders: [packagePath],
};