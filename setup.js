const AppDataSource = require('./utils/configs.js');
const User = require('./models/user.js');
const Role = require('./models/role.js');
const {DataSource} = require('typeorm');


const appDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true, // modify database
    logging: false,
    entities: ["../models/**/*.js"],
});

const setupDatabase = async () => {
    try {
        await appDataSource.initialize();
        const userRepository = appDataSource.getRepository(User);
        const roleRepository = appDataSource.getRepository(Role);
        roleRepository.name = "12345";
        console.log("NAME: " + roleRepository.name);
        console.log("FIND: " + roleRepository.find());
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
                { username: 'admin', email: 'tuannguyen23823@gmail.com', password: 'admin', phoneNumber: '0937837564', status: 'active', roles: [adminRole] }
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

module.exports = setupDatabase;