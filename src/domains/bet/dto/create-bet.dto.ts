import { ApiProperty } from "@nestjs/swagger";

export class CreateBetDto {
    @ApiProperty({ required: true})
    groupId: string;

    @ApiProperty({ required: true})
    title: string;

    @ApiProperty({ required: true})
    options: string[];

    @ApiProperty()
    category: string;

    @ApiProperty({ required: true})
    wagerOption: string

    @ApiProperty({ required: true})
    wagerAmount: number
}