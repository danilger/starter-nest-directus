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
    origin: [
      'http://localhost:5173',
      'http://localhost',
      'http://127.0.0.1',
      'http://192.168.0.33',
      'http://192.168.0.33:3000',
      'http://192.168.0.33:5173',
    ],
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Попытка получить Directus OpenAPI спецификацию (опционально)
  let directusDocument = null;
  try {
    directusDocument = await fetch(
      'http://directus:8055/server/specs/oas',
      { signal: AbortSignal.timeout(5000) } // таймаут 5 секунд
    ).then((res) => res.json());
    console.log('Directus OpenAPI спецификация загружена');
  } catch (error) {
    console.warn('Не удалось загрузить Directus OpenAPI спецификацию:', error.message);
    console.warn('Swagger для Directus будет недоступен. Directus может быть еще не готов.');
  }

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

  SwaggerModule.setup('docs', app, document, swaggerOptions);
  
  // Настройка Swagger для Directus только если спецификация загружена
  if (directusDocument) {
    SwaggerModule.setup('directus', app, directusDocument, swaggerOptions);
  }

  // Создаем GET маршрут для openapi.json основного приложения
  app.getHttpAdapter().get('/api/openapi.json', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(document);
  });

  // Создаем GET маршрут для openapi.json Directus (если доступно)
  if (directusDocument) {
    app.getHttpAdapter().get('/api/directus/openapi.json', (req, res) => {
      res.header('Content-Type', 'application/json');
      res.send(directusDocument);
    });
  }

  // Start server
  const port = process.env.BACKEND_PORT || process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
