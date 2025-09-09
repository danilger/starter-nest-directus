import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Настройка cookie-parser
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Создаем GET эндпоинт для openapi.json
  app.getHttpAdapter().get('/api/openapi.json', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(document);
  });

  // Start server
  const res = await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
