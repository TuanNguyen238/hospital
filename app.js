const express = require('express');
const Setup = require('./setup.js');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user-routes.js');
const AppDataSource = require('./utils/configs.js');

dotenv.config();

if (AppDataSource.isInitialized) {
    const setup = new Setup();
    setup.setupDatabase()
    .then(() => console.log("Database setup complete"))
    .catch(err => console.error("Database setup failed:", err));
} else {
    console.error('DataSource has not been initialized.');
}

const app = express();
const PORT = process.env.PORT || 3000;
console.log("PORT: " + PORT);

app.use(express.json());
app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
