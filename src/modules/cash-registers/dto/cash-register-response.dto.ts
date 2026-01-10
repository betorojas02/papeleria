import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UserDto {
    @Expose()
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;
}

export class CashRegisterResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    openingAmount: number;

    @ApiProperty()
    @Expose()
    closingAmount: number;

    @ApiProperty()
    @Expose()
    status: string;

    @ApiProperty()
    @Expose()
    openedAt: Date;

    @ApiProperty()
    @Expose()
    closedAt: Date;

    @ApiProperty({ type: UserDto })
    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
