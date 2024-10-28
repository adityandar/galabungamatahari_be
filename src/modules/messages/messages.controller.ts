import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { Message } from "@prisma/client";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post()
    createMessage(
        @Body() createMessageDto: CreateMessageDto,
        @Req() req: ExpressRequestWithUser,
    ): Promise<Message> {
        createMessageDto.userId = req.user.sub;

        return this.messagesService.createMessage(createMessageDto);
    }

    @Get()
    getAllMessages(): Promise<Message[]> {
        return this.messagesService.getAllMessages();
    }

    // for update and delete, use IsMineGuard()
}