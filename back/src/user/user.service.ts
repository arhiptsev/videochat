import { Prisma, User } from '@prisma/client';
import UserCreateInput = Prisma.UserCreateInput;
import UserUpdateInput = Prisma.UserUpdateInput;
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(

    private prisma: PrismaService
  ) { }

  public findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  public async addUser(userData: Omit<UserCreateInput, 'created_at'>): Promise<any> {
    if (await this.checkUsernameExist(userData.username)) {
      throw new HttpException('Username already exist', HttpStatus.BAD_REQUEST)
    }
    userData.password = hashSync(userData.password, 10);
    const created_at = new Date().getTime();

    await this.prisma.user.create({
      data: { ...userData, created_at },
    });
  }

  public findByUsername(username: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { username: username } });
  }

  public updateById(id: number, data: Partial<UserUpdateInput>): Promise<User> {
    return this.prisma.user.update({
      data, where: {
        id: id
      }
    });
  }

  public findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public getUserProfile(id: number): Promise<Pick<User, 'username' | 'email'>> {
    return this.prisma.user.findUnique({
      select: { username: true, email: true },
      where: { id }
    });
  }

  public async checkUserExist(id: number): Promise<boolean> {
    const res = await this.findById(id);
    return !!res;
  }

  public async checkUsernameExist(username: string): Promise<boolean> {
    const res = await this.findByUsername(username);
    return !!res;
  }

}
