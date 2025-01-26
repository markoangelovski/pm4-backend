import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('PM4 API')
  .setDescription('API for PM4')
  .setVersion('0.0.1')
  .addBearerAuth()
  .addTag('PM4')
  .build();
