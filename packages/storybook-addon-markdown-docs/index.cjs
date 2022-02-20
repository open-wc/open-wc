

const mdjsToCsf = async (markdown, filePath, projectType, mdjsOptions = {}) => {
    const { mdjsToCsf: mdjsToCsfImpl } = await import('./src/mdjsToCsf.js');
    return mdjsToCsfImpl(markdown, filePath, projectType, mdjsOptions);
}

module.exports = { mdjsToCsf };
