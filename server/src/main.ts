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

  const directusDocument = await fetch(
    'http://localhost:8055/server/specs/oas',
  ).then((res) => res.json());

  // Настройки для Swagger UI с credentials: 'include'
  const swaggerOptions = {
    swaggerOptions: {
      requestInterceptor: (req) => {
        // Добавляем credentials: 'include' ко всем запросам
        req.credentials = 'include';
        return req;
      },
      withCredentials: true,
    },
  };

  SwaggerModule.setup('api', app, document, swaggerOptions);
  SwaggerModule.setup('directus', app, directusDocument, swaggerOptions);

  // Создаем GET маршрут для openapi.json основного приложения
  app.getHttpAdapter().get('/api/openapi.json', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(document);
  });

  // Создаем GET маршрут для openapi.json Directus
  app.getHttpAdapter().get('/api/directus/openapi.json', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(directusDocument);
  });

  // Start server
  const res = await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
