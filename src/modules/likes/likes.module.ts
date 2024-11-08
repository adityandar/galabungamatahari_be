import { Module } from "@nestjs/common";
import { LikesController } from "./likes.controller";
import { MessagesService } from "../messages/messages.service";
import { LikesService } from "./likes.service";
import { MessagesModule } from "../messages/messages.module";

@Module({
    controllers: [LikesController],
    providers: [LikesService],
    imports: [MessagesModule],
})
export class LikesModule { }