import { ApiProperty } from '@nestjs/swagger';

export class CreateWagerDto {
  @ApiProperty({ required: true })
  betId: string;

  @ApiProperty({ required: true })
  optionId: string;

  @ApiProperty({ required: true })
  amount: number;
}
