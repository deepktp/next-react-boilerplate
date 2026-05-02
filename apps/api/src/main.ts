import { config } from 'dotenv';
config({ path: '../../.env.development' });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import helmet from 'helmet';
import { AppLogger } from './common/logger/app-logger.service';
import util from 'util';

if (process.env.NODE_ENV === 'development') {
  util.inspect.defaultOptions.depth = null;
  util.inspect.defaultOptions.maxArrayLength = Infinity;
  util.inspect.defaultOptions.maxStringLength = Infinity;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  let appLogger: AppLogger | undefined;
  try {
    appLogger = app.get(AppLogger);
    app.useLogger(appLogger);
  } catch {
    appLogger = undefined;
  }

  process.on('unhandledRejection', (reason) => {
    const trace = typeof reason === 'object'
      ? (reason as any).stack || JSON.stringify(reason)
      : String(reason);
    appLogger?.error('unhandledRejection', trace, { reason });
  });

  process.on('uncaughtException', (err) => {
    const trace = (err as Error).stack || String(err);
    appLogger?.error('uncaughtException', trace, {});
    if (process.env.NODE_ENV === 'production') process.exit(1);
  });

  if (process.env.NODE_ENV === 'development') {
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
      : ['http://localhost:5173'];

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Tenant-Slug',
        'X-Organization-Id',
      ],
      credentials: true,
    });
  }

  app.use(helmet());

  if (process.env.ENABLE_CSP !== 'false') {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https:', "'unsafe-inline'"],
          styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https:'],
          frameAncestors: ["'none'"],
        },
      }),
    );
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('v1');

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  appLogger?.log('server_started', { url: `http://localhost:${port}` });
  if (process.env.NODE_ENV !== 'production') {
    appLogger?.log('swagger_ready', { url: `http://localhost:${port}/docs` });
  }
}

bootstrap();
