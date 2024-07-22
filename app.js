import express from 'express';
import userController from './controller/user-controller.js';
import { Setup } from './setup.js';
import dotenv from 'dotenv';

dotenv.config()
const setup = new Setup();

setup.setupDatabase()
    .then(() => console.log("Database setup complete"))
    .catch(err => console.error("Database setup failed:", err));

const app = express();
const PORT = process.env.MYSQL_PORT;

app.use(express.json());
app.use('/users', userController);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
