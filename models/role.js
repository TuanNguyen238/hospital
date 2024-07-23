const { EntitySchema } = require('typeorm');

const Role = new EntitySchema({
    name: 'Role',
    tableName: 'roles',
    columns: {
        name: {
            primary: true,
            type: 'varchar',
            length: 255,
            generated: true
        },
        description: {
            type: 'varchar',
            length: 255
        }
    },
    relations: {
        users: {
            target: 'User',
            type: 'many-to-many',
            inverseSide: 'roles'
        }
    }
});

module.exports = Role;
