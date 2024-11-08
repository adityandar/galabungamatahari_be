import { Body, Controller, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { CreateLikeDto } from "./dtos/create-like.dto";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";
import { create } from "domain";
import { LikesService } from "./likes.service";

@Controller('likes')
export class LikesController {

    constructor(private readonly likesService: LikesService) { }

    @Post(':id')
    likeMessage(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: ExpressRequestWithUser,
    ): Promise<Boolean> {
        const createLikeDto = new CreateLikeDto();
        createLikeDto.messageId = id;
        createLikeDto.userId = req.user.sub;


        return this.likesService.likeMessage(createLikeDto);
    }
}