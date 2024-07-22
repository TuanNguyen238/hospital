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
    }
});

module.exports = Role;