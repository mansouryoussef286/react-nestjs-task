import { registerAs } from '@nestjs/config';

export default registerAs('Config', () => ({
  Env: process.env.NODE_ENV ?? '',
  Server: {
    Host: process.env.SERVER_HOST ?? '',
    Port: parseInt(process.env.SERVER_PORT ?? '3000', 10),
    FrontEndHost: process.env.SERVER_FRONTEND_HOST ?? '',
  },
  Database: {
    Uri: process.env.DATABASE_URI ?? '',
    name: process.env.DATABASE_NAME ?? '',
  },
  Auth: {
    Jwt: {
      Key: process.env.AUTH_JWT_KEY ?? '',
      Lifespan: process.env.AUTH_ACCESS_TOKEN_LIFESPAN ?? '',
      Issuer: process.env.AUTH_JWT_ISSUER ?? '',
      Audience: process.env.AUTH_JWT_AUDIENCE ?? '',
      RefreshTokenLifeSpan: process.env.AUTH_REFRESH_TOKEN_LIFESPAN ?? '',
    },
  },
}));
