import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/services/prisma.service";
import { MessagesService } from "../messages/messages.service";
import { CreateLikeDto } from "./dtos/create-like.dto";
import { create } from "domain";

@Injectable()
export class LikesService {
    constructor(
        private prismaService: PrismaService,
        private messagesService: MessagesService,
    ) { }

    async likeMessage(createLikeDto: CreateLikeDto): Promise<Boolean> {
        try {
            const message = await this.messagesService.getMessageById(createLikeDto.messageId);

            const like = await this.prismaService.like.findFirst({
                where: {
                    messageId: createLikeDto.messageId,
                    userId: createLikeDto.userId,
                }
            });

            // belum dilike
            if (!like) {
                const newLike = await this.prismaService.like.create({
                    data: {
                        ...createLikeDto,
                    },
                });

                return true;
            } else {
                await this.prismaService.like.delete({
                    where: { id: like.id }
                });

                return false;
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}