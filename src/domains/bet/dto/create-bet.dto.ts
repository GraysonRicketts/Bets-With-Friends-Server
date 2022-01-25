import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateBetDto {
  @ApiProperty({ required: true })
  groupId: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: true })
  options: string[];

  @ApiProperty({ required: true })
  wagerOption: string;

  @ApiProperty({ required: true })
  wagerAmount: number;

  @ApiProperty()
  @IsOptional()
  category?: string;
}
