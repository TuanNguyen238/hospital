const { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } = require('typeorm');
const Role = require('./role.js');

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    username;

    @Column()
    email;

    @Column()
    password;

    @Column()
    phoneNumber;

    @Column()
    status;

    @ManyToMany(() => Role)
    @JoinTable()
    roles;
}

module.exports = User;