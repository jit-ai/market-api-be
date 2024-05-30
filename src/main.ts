import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('server_port');
  const globalPrefix = config.get('global_prefix');
  app.enableCors({
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'Authorization',
      'Accept-Encoding',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    origin : "*"
  });

  const configSwagger = new DocumentBuilder()
    .setTitle('Market Place Swagger')
    .setDescription('The Market Place API description')
    .setVersion('1.0')
    .addTag('Market-Place')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);  
  await app.listen(port);
  
  console.log(`Application is running on http://localhost:${port}`);

}
bootstrap();
