import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AddFriendDto {
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;
}
