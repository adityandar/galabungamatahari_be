import { Body, Controller, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";
import { create } from "domain";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post(':id')
    createComment(
        @Param('id', ParseIntPipe) id: number,
        @Body() createCommentDto: CreateCommentDto,
        @Req() req: ExpressRequestWithUser,
    ) {
        createCommentDto.userId = req.user.sub;
        createCommentDto.messageId = id;

        return this.commentsService.createComment(createCommentDto);
    }
}