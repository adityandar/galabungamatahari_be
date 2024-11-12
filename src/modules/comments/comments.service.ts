import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/services/prisma.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { Comment } from "@prisma/client";

@Injectable()
export class CommentsService {
    constructor(private readonly prismaService: PrismaService) { }

    async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        try {
            const newComment = await this.prismaService.comment.create({
                data: {
                    ...createCommentDto,
                },
            });

            return newComment;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}