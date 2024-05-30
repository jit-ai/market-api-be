import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    firstName: string;

    @Column({ type: 'varchar', nullable: true })
    lastName: string;

    @Column({ type: 'varchar', nullable: true })
    userName: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    password: string;

    @Column({ type: 'bigint', nullable: true })
    phone: number;

    @Column({ type: 'varchar', nullable: true })
    gender: string;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'varchar', nullable: true })
    zipCode: string;

    @Column({ type: 'varchar', nullable: true })
    category: string;

    @Column({ type: 'int', nullable: true })
    age: number;

    @CreateDateColumn({ type: 'datetime' })
    createdDate: Date;

    @UpdateDateColumn({ type: 'datetime', nullable: true, default: () => 'null' })
    updatedDate: Date;
}
