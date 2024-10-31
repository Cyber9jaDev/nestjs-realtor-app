// Import statements are properly arranged in a logical order
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; 
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // App creation
  const app = await NestFactory.create(AppModule);

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Realtor App')
    .setDescription('Realtor APP API description')
    .setVersion('1.0')
    .addTag('Realtor')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Global pipes configuration
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));

  // Start server
  await app.listen(3000);
}
bootstrap();
