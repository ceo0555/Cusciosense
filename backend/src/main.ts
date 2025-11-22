import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1'
  app.setGlobalPrefix(apiPrefix)

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SchoolOS API')
    .setDescription('School ERP and Learning Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('schools', 'School management')
    .addTag('students', 'Student management')
    .addTag('teachers', 'Teacher management')
    .addTag('classes', 'Class management')
    .addTag('subjects', 'Subject management')
    .addTag('courses', 'Course management')
    .addTag('homework', 'Homework management')
    .addTag('exams', 'Exam management')
    .addTag('attendance', 'Attendance management')
    .addTag('fees', 'Fee management')
    .addTag('payments', 'Payment management')
    .addTag('notifications', 'Notification management')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = configService.get('PORT') || 3001
  await app.listen(port)

  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`)
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
