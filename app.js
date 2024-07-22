const express = require('express');
const Setup = require('./setup.js');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user-routes.js');
const AppDataSource = require('./utils/configs.js');

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected and synchronized!');
        const setup = new Setup();
        return setup.setupDatabase();
    })
    .then(() => {
        console.log("Database setup complete");
        const app = express();
        const PORT = process.env.PORT || 3000;
        console.log("PORT: " + PORT);

        app.use(express.json());
        app.use("/users", userRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection or setup error:', err);
    });
