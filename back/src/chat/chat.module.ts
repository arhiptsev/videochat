import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/constants';
import { UserModule } from 'src/user/user.module';
import { VideoGateway } from './video/video.gateway';

@Module({
  providers: [
    VideoGateway,
  ],
  imports: [
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    })
  ],
  exports: [
    VideoGateway,
  ]
})
export class ChatModule { }
