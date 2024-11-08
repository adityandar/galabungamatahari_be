import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Message } from "@prisma/client";
import { PrismaService } from "src/core/services/prisma.service";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { create } from "domain";
import { UpdateMessageDto } from "./dtos/update-message.dto";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";
import { paginate, paginateOutput, PaginateOutput } from "src/common/utils/pagination.util";

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
        try {
            const newMessage = await this.prisma.message.create({
                data: {
                    ...createMessageDto,
                }
            });

            return newMessage;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already registered');
            }
            if (error.code === 'P2003') {
                throw new NotFoundException('Author not found');
            }

            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMessageById(id: number): Promise<Message> {
        try {
            const message = await this.prisma.message.findUniqueOrThrow({
                where: { id },
            });

            return message;
        } catch (error) {
            // check if post not found and throw error
            if (error.code === 'P2025') {
                throw new NotFoundException(`Message with id ${id} not found`);
            }

            // throw error if any
            throw new HttpException(error, 500);
        }
    }

    async getAllMessages(query?: QueryPaginationDto): Promise<PaginateOutput<Message>> {
        const [messages, total] = await Promise.all([
            await this.prisma.message.findMany({
                ...paginate(query),
                include: {
                    _count: {
                        select: {
                            likes: true,
                        }
                    }
                }
            }),
            await this.prisma.message.count(),
        ]);

        const formattedMessages = messages.map(message => ({
            ...message,
            likesCount: message._count.likes,  // Add the likes count to the message
            _count: undefined,
        }));

        return paginateOutput(formattedMessages, total, query);

    }

    async updateMessage(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
        try {
            await this.prisma.message.findUniqueOrThrow({
                where: { id },
            });

            const updatedPost = this.prisma.message.update({
                where: { id },
                data: {
                    ...updateMessageDto,
                },
            });

            return updatedPost;
        } catch (error) {
            // check if post not found and throw error
            if (error.code === 'P2025') {
                throw new NotFoundException(`Message with id ${id} not found`);
            }

            // check if email already registered and throw error
            if (error.code === 'P2002') {
                throw new ConflictException('Email already registered');
            }

            // throw error if any
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteMessage(id: number): Promise<string> {
        try {
            const message = await this.prisma.message.findUniqueOrThrow({
                where: { id },
            });

            await this.prisma.message.delete({
                where: { id }
            });

            return `Message with id ${id} deleted`;
        } catch (error) {
            // check if post not found and throw error
            if (error.code === 'P2025') {
                throw new NotFoundException(`Post with id ${id} not found`);
            }

            // throw error if any
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}