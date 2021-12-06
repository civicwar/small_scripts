import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DefendEntity {

    @ApiProperty({
        readOnly: true,
    })
    @CreateDateColumn()
    createDate?: Date;

    @ApiProperty({
        readOnly: true,
    })
    @UpdateDateColumn()
    updateDate?: Date;

}
