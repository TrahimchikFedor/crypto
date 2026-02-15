import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    const config = new DocumentBuilder()
        .setTitle('Crypto')
        .setDescription('The crypto API description')
        .build();

    const documnetFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, documnetFactory);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
