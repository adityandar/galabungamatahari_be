import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    to: string;

    userId: number;
}