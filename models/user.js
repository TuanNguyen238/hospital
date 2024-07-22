import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import Role from './role.js';

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

export default User;