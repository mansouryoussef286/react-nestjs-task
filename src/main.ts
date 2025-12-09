import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Config } from '@App/Config/App.Config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Handle unhandled promise rejections globally
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const config = configService.get<Config>('Config');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //#region Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nextjs Api')
    .setDescription('The Nextjs API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document: any = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, document);
  //#endregion

  app.enableCors({
    origin: '*',
  });

  await app.listen(config!.Server.Port).then(async () => {
    const url = await app.getUrl();
    console.log(`ENV= ${config!.Env}`);
    console.log(`Server  running on ${url}`);
    console.log(`Swagger running on ${url}/api/swagger`);
  });
}
bootstrap();
