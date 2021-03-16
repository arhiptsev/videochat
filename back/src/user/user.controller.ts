import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserProfile } from './types/user-profile';
import { ApiBody } from '@nestjs/swagger';
import { User, Prisma } from '.prisma/client';
import UserCreateInput = Prisma.UserCreateInput;

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('registration')
  public async registration(@Body() userData: Pick<UserCreateInput,
    'password' | 'username' | 'email'
  >): Promise<void> {

    return await this.userService.addUser(userData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req): Promise<UserProfile> {
    return this.userService.findById(req.user.id);
  }
}
