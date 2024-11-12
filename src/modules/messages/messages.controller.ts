import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { Message } from "@prisma/client";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";
import { UpdateMessageDto } from "./dtos/update-message.dto";
import { IsMineGuard } from "../../common/guards/is-mine.guard";
import { QueryPaginationDto } from "../../common/dtos/query-pagination.dto";
import { PaginateOutput } from "../../common/utils/pagination.util";

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
    getAllMessages(
        @Query() query?: QueryPaginationDto,
    ): Promise<PaginateOutput<Message>> {
        return this.messagesService.getAllMessages(query);
    }

    @Get(':id')
    getMessageById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Message> {
        return this.messagesService.getMessageById(id);
    }

    @Patch(':id')
    @UseGuards(IsMineGuard)
    updateMessage(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateMessageDto: UpdateMessageDto,
    ): Promise<Message> {
        return this.messagesService.updateMessage(id, updateMessageDto);
    }

    @Delete(':id')
    @UseGuards(IsMineGuard)
    deleteMessage(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<string> {
        return this.messagesService.deleteMessage(id);
    }
}