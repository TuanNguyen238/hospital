const { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } = require('typeorm');
const User = require('./user.js');

@Entity()
class Role {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    name;

    @ManyToMany(() => User, user => user.roles)
    @JoinTable()
    users;
}

module.exports = Role;
