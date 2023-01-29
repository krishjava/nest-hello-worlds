import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import secureSession from '@fastify/secure-session';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  // app.setGlobalPrefix('api');  // to set gloabl routes
  // const sessionApp = await NestFactory.create<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter(),
  // );
  // await sessionApp.register(secureSession, {
  //   secret: 'averylogphrasebiggerthanthirtytwochars',
  //   salt: 'mq9hDxBVDbspDR6n',
  // });
  await app.listen(3004);
}
bootstrap();
