import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

const localOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3101",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3101",
];

const baseAllowedHeaders = ["content-type"];
const developmentAllowedHeaders = [
  "x-sportil-admin-user",
  "x-sportil-demo-user",
  "x-sportil-dev-role",
  "x-sportil-dev-user",
];

function commaSeparated(value: string | undefined) {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

function resolveCorsOrigins() {
  const configuredOrigins = commaSeparated(process.env.SPORTIL_ALLOWED_ORIGINS);

  if (process.env.NODE_ENV === "production") {
    return configuredOrigins;
  }

  return Array.from(new Set([...localOrigins, ...configuredOrigins]));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigins = resolveCorsOrigins();

  app.enableCors({
    allowedHeaders:
      process.env.NODE_ENV === "production"
        ? baseAllowedHeaders
        : [...baseAllowedHeaders, ...developmentAllowedHeaders],
    methods: ["DELETE", "GET", "PATCH", "POST", "OPTIONS"],
    origin: corsOrigins.length > 0 ? corsOrigins : false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
}

void bootstrap();
