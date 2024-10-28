import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Message } from "@prisma/client";
import { PrismaService } from "src/core/services/prisma.service";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { create } from "domain";

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

    async getAllMessages(): Promise<Message[]> {
        const messages = await this.prisma.message.findMany();

        return messages;
    }


}