import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/decorators/roles.decorator';

export class UserResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    firstName: string;

    @ApiProperty()
    @Expose()
    lastName: string;

    @ApiProperty()
    @Expose()
    email: string;

    @ApiProperty({ enum: UserRole })
    @Expose()
    role: UserRole;

    @ApiProperty()
    @Expose()
    isActive: boolean;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    @Exclude()
    password: string;

    @Exclude()
    deletedAt?: Date;
}
