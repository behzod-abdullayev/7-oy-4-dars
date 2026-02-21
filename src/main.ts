import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express"


async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  const condig = new DocumentBuilder()
    .setTitle("article project")
    .setDescription("article documentation")
    .setVersion("1.0.0")
    .addBearerAuth({
      type:"http",
      scheme: "bearer",
      name: "JWT",
      description: "JWT token from header",
      bearerFormat: "JWT",
      in: "header"
    })
    .build();

  const document = SwaggerModule.createDocument(app, condig);

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })

  app.use("/uploads", express.static("uploads"))
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`server is running at: http://localhost:${PORT}`);
    console.log(`documentation link: http://localhost:${PORT}/api`);
  });
}
bootstrap();
