const { EntitySchema } = require('typeorm');

const Role = new EntitySchema({
    name: 'Role',
    tableName: 'roles',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar',
            length: 255
        }
    },
    relations: {
        users: {
            target: 'User',
            type: 'many-to-many',
            inverseSide: 'roles',
            joinTable: true
        }
    }
});

module.exports = Role;