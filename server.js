const express = require('express');
const uploadRoutes = require('./routes/csvRoutes');
require('dotenv').config();

const app = express();
const port = 3000;

app.use('/api', uploadRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});