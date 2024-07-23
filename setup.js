const AppDataSource = require('./utils/configs.js');
const User = require('./models/user.js');
const Role = require('./models/role.js');

class Setup {
    async setupDatabase() {
        try {
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