import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SimpleConsoleLogger } from 'typeorm';
import { AuthService } from '../auth.service';

@Controller('auth')
export class AuthController {

    constructor (
        private authService: AuthService
    ){}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    public async test(@Request() req): Promise<void> {
      return this.authService.login(req.user);
    }
  
}
