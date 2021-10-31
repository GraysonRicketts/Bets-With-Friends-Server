import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupDto {
    @ApiProperty({required: true})
    name: string;
}