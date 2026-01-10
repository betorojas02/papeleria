import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from '../../common/decorators/roles.decorator';
import { Sale } from './sale.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.EMPLOYEE,
    })
    role: UserRole;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @OneToMany(() => Sale, (sale) => sale.user)
    sales: Sale[];
}
