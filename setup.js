const { DataSource } = require('typeorm');
const User = require('./models/user.js');
const Role = require('./models/role.js');
const dotenv = require('dotenv');

dotenv.config();

class Setup {
    #appDataSource;
    constructor() {
        this.#appDataSource = new DataSource({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            synchronize: true, // modify database
            logging: false,
            entities: [User, Role],
        });
        console.log("PORT SETUP: " + process.env.MYSQL_PORT);
    }
    
    async setupDatabase() {
        try {
            await this.#appDataSource.initialize();
            console.log('Database connected and synchronized!');
    
            const userRepository = this.#appDataSource.getRepository(User);
            const roleRepository = this.#appDataSource.getRepository(Role);
    
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
}


module.exports = Setup;