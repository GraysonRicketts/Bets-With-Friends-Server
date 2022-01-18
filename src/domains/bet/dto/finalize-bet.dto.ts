import { ApiProperty } from '@nestjs/swagger';

export class FinalizeBetDto {
  @ApiProperty({ required: true })
  betId: string;

  @ApiProperty({ required: true })
  winningOptionId: string;
}
