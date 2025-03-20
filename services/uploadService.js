const axios = require("axios");
const csv = require("csv-parser");
const User = require("../models/userSchema");
const UploadService = {
    async processCSV(url) {
        try {
            const results = [];

            const response = await axios.get(url, { responseType: 'stream' });

            return new Promise((resolve, reject) => {
                response.data
                    .pipe(csv())
                    .on('data', (data) => {
                        try {
                            const { ['name.firstName']: firstName, ['name.lastName']: lastName, age, ...rest } = data;

                            if (!firstName || !lastName || !age) {
                                throw new Error('Missing mandatory fields');
                            }

                            const userData = {
                                name: `${firstName} ${lastName}`,
                                age: parseInt(age, 10),
                                additionalInfo: parsingObject(rest),
                            };
                            if (userData.additionalInfo.address) {
                                userData.address = userData.additionalInfo.address;
                                delete userData.additionalInfo.address;
                            }
                            results.push(userData);
                        } catch (err) {
                            console.error('Error processing CSV row:', err.message);
                        }
                    })
                    .on('end', async () => {
                        try {
                            // console.log(JSON.stringify(results, null, 2));
                            await User.bulkCreate(results, { validate: true });
                            resolve('Upload complete');
                        } catch (err) {
                            reject(`Database insert error: ${err.message}`);
                        }
                    })
                    .on('error', (error) => reject(`CSV parsing error: ${error.message}`));
            });
        } catch (error) {
            throw new Error(`Failed to fetch CSV: ${error.message}`);
        }
    },

  async calculateAgeDistribution() {
    const users = await User.findAll();
    const total = users.length;
    const distribution = {
      "<20": 0,
      "20-40": 0,
      "40-60": 0,
      ">60": 0,
    };

    users.forEach((user) => {
      if (user.age < 20) {
        distribution["<20"]++;
      } else if (user.age >= 20 && user.age < 40) {
        distribution["20-40"]++;
      } else if (user.age >= 40 && user.age < 60) {
        distribution["40-60"]++;
      } else {
        distribution[">60"]++;
      }
    });

    return Object.entries(distribution).map(([group, ageCount]) => ({
      "Age-Group": group,
      "% Distribution": ((ageCount / total) * 100).toFixed(2),
    }));
  },
};

function parsingObject(data) {
  const result = {};

  for (const key in data) {
    const value = data[key];
    const keys = key.split(".");
    let current = result;

    keys.forEach((k, index) => {
      if (!current[k]) {
        current[k] = index === keys.length - 1 ? value : {};
      }
      current = current[k];
    });
  }

  return result;
}

module.exports = UploadService;
