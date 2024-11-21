import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './common/filters/error-response/error-response.filter';
import { ResponseInterceptor } from './common/interceptors/transform/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply custom exception filter globally
  app.useGlobalFilters(new CustomExceptionFilter());

  // Apply response interceptor globally
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
