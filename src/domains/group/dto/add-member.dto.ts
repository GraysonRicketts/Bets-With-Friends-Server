import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({ required: true })
  @IsUUID()
  groupId: string;

  @ApiProperty({ required: true })
  @IsUUID(undefined, { each: true })
  members: string[];
}
