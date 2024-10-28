import {
  ConflictException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/core/services/prisma.service';
import { LoginUserDto } from './dto/login-user.do';
import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
import { create } from 'domain';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService,) { }

  // async registerUser
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: await hash(createUserDto.password, 10),
          name: createUserDto.name,
        },
      });

      delete newUser.password;

      return newUser;

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async loginUser
  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginUserDto.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!(await compare(loginUserDto.password, user.password))) {
        throw new UnauthorizedException('invalid credentials');
      }

      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  // async updateUser
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          ...(updateUserDto.password && {
            password: await hash(updateUserDto.password, 10),
          }),
        },
      });

      delete updatedUser.password;

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ${id} not found`);
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered to other user');
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async deleteUser
  async deleteUser(id: number): Promise<string> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });

      await this.prisma.user.delete({
        where: { id },
      });

      return `User with id ${id} successfully deleted`;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


