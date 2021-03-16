import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';
import { readFileSync } from 'fs';
import { AppModule } from 'src/app.module';


const httpsOptions = {
  key: readFileSync(process.env['KEY_PATH']),
  cert: readFileSync(process.env['CERT_PATH']),
  passphrase: process.env['CERT_PASS']
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));

  const options = new DocumentBuilder()
    .setTitle('Документация к API')
    .setDescription('Прикрутил swagger чтобы показать всем, что я прикрутил swagger :)')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env['PORT'] || 3000);
}
bootstrap();
