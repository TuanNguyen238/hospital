import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from './models/user.js';
import Role from './models/role.js';
import dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true, // modify database
    logging: false,
    entities: [User, Role],
});

const setupDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected and synchronized!');

        const userRepository = AppDataSource.getRepository(User);
        const roleRepository = AppDataSource.getRepository(Role);

        let adminRole = await roleRepository.findOneBy({ name: 'admin' });
        if (!adminRole) {
            adminRole = roleRepository.create({ name: 'admin' });
            await roleRepository.save(adminRole);
            console.log('Admin role created.');
        }

        const users = await userRepository.find();
        if (users.length === 0) {
            console.log('Users table does not exist or is empty. Seeding data...');
            const usersData = [
                { username: 'admin1', email: 'hendong34@gmail.com', password: 'admin1', phoneNumber: '0799699159', status: 'active', roles: [adminRole] },
                { username: 'admin2', email: 'tuannguyen23823@gmail.com', password: 'admin2', phoneNumber: '0943640913', status: 'active', roles: [adminRole] },
                { username: 'admin3', email: 'lethithuyduyen230803@gmail.com', password: 'admin3', phoneNumber: '0937837564', status: 'active', roles: [adminRole] }
            ];
            await userRepository.save(usersData);
            console.log('Users seeded.');
        } else {
            console.log('Users table already exists or is not empty.');
        }
    } catch (err) {
        console.error('Error occurred:', err);
    }
};

export default setupDatabase;
