import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @Length(2, 500)
    @ApiProperty({default: "CSS"})
    heading: string;

@IsString()
@Length(20, 20000)
@ApiProperty({default: "CSS"})
    body: string;

}


