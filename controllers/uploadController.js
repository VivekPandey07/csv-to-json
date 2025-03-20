const UploadService = require('../services/uploadService');

const UploadController = {
    async uploadCSV(req, res) {
        try {
            await UploadService.processCSV(process.env.CSV_LINK);
            const ageDistribution = await UploadService.calculateAgeDistribution();
            console.table(ageDistribution);
            res.send('CSV data uploaded and age distribution calculated.');
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while processing the CSV file.');
        }
    },
};

module.exports = UploadController;