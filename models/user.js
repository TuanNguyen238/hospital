const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        username: {
            type: 'varchar',
            length: 255
        },
        email: {
            type: 'varchar',
            length: 255,
            nullable: true
        },
        password: {
            type: 'varchar',
            length: 255
        },
        phoneNumber: {
            type: 'varchar',
            length: 20,
            unique: true
        },
        status: {
            type: 'tinyint'
        }
    },
    relations: {
        roles: {
            target: 'Role',
            type: 'many-to-many',
            joinTable: true
        }
    }
});

module.exports = User;