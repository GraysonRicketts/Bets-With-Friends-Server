import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

class CreateUserDto {
  @IsString()
  @ApiProperty({ required: true })
  displayName: string;
}

export class CreateLocalUserDto extends CreateUserDto {
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @MinLength(5)
  @ApiProperty({ required: true })
  password: string;
}
