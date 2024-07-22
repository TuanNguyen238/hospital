export const UserQuery = {
    createTable: `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(20),
        status TINYINT(1) NOT NULL,
        role VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    createUser: 'INSERT INTO users (name, email, password, phoneNumber, status, role) VALUES (?, ?, ?, ?, ?, ?)',
    showTable: 'SHOW TABLES LIKE ?',
    getUserById: 'SELECT * FROM users WHERE id = ?',
    getAllUsers: 'SELECT * FROM users'
};