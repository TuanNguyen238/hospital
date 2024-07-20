import express from 'express';
import userController from './user-controller.js';
import { Setup } from '../setup.js';

const setup = new Setup();

setup.setupDatabase()
    .then(() => console.log("Database setup complete"))
    .catch(err => console.error("Database setup failed:", err));

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/users', userController);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
