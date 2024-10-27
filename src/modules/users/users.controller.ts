import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { LoginUserDto } from './dto/login-user.do';
import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
import { Public } from 'src/common/decorators/public.decorators';
import { ExpressRequestWithUser } from './interfaces/express-request-with-user.interface';
import { IsMineGuard } from 'src/common/guards/is-mine.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.registerUser(createUserDto);
  }

  @Public()
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.usersService.loginUser(loginUserDto);
  }


  @Get('me')
  me(@Req() req: ExpressRequestWithUser): UserPayload {
    return req.user;
  }

  @Patch(':id')
  @UseGuards(IsMineGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,

  ): Promise<User> {
    return this.usersService.updateUser(+id, updateUserDto);
  }


  @Delete(':id')
  @UseGuards(IsMineGuard)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return this.usersService.deleteUser(+id);
  }
}
