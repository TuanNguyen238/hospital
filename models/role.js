import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.js';

@Entity()
class Role {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    name;

    @ManyToMany(() => User, user => user.roles)
    users;
}

export default Role;
