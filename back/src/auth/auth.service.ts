import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from '.prisma/client';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    public async validateUser(username: string, password: string): Promise<User> {
        const res = await this.userService.findByUsername(username);
        if (!res) { return null; }
        if (!compareSync(password, res.password)) { return null; }
        return res;
    }

    public async login({ username, id }: Pick<User, 'username' | 'id'>): Promise<any> {
        const payload = { username: username, id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
