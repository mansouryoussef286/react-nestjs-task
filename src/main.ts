import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Config } from '@App/Config/App.Config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Handle unhandled promise rejections globally
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  const configService = app.get(ConfigService);
  const config = configService.get<Config>('Config');

  //#region Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Chehabi Academy Api')
    .setDescription('The Chehabi Academy API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document: any = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  // app.use(SwaggerSecurity());
  //#endregion

  app.enableCors({
    origin: '*',
  });

  await app.listen(config!.Server.Port).then(async () => {
    const url = await app.getUrl();
    console.log(`ENV= ${config!.Env}`);
    console.log(`Server  running on ${url}`);
    console.log(`Swagger running on ${url}/swagger`);
  });
}
bootstrap();
