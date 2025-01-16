const fileService = require('../service/file-service');

async function generateFileUrls(directory, category, req) {
    if (!directory) {
        return [];
    }

    try {
        const files = await fileService.getFiles(directory);

        return files.map(file => `${req.protocol}://${req.get('host')}/api/download/${category}/${directory}/${file}`);
    } catch (error) {
        if (error.message.includes('не найдена')) {
            return [];
        }
        throw error;
    }
}

module.exports = generateFileUrls;
