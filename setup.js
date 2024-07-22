const AppDataSource = require('./utils/configs.js');
const User = require('./models/user.js');
const Role = require('./models/role.js');
const { DataSource } = require('typeorm');

class Setup {

    async setupDatabase() {
        try {
            const appDataSource = new DataSource({
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                username: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                synchronize: true, // Tự động đồng bộ hóa thực thể với cơ sở dữ liệu
                logging: false,
                entities: [User, Role],
            });
            const userRepository = appDataSource.getRepository(User);
            const roleRepository = appDataSource.getRepository(Role);
            roleRepository.name = 'vcl';
            console.log(roleRepository);
    
            let adminRole = await userRepository.findOneBy({ name: 'admin' });
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
}


module.exports = Setup;