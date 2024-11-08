import { IsNumber } from "class-validator";

export class CreateLikeDto {

    //   id        Int      @id @default(autoincrement())
    //   userId    Int?
    //   user      User?    @relation(fields: [userId], references: [id])
    //   messageId Int?
    //   message   Message? @relation(fields: [messageId], references: [id])
    @IsNumber()
    messageId: number;

    userId: number;
}