import { ApiProperty } from "@nestjs/swagger";

class CreateUserDto {
    @ApiProperty({ required: true})
    displayName: string
}

export class CreateLocalUserDto extends CreateUserDto {
    @ApiProperty({ required: true})
    email: string

    @ApiProperty({ required: true})
    password: string
}