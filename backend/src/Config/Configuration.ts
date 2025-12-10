import { registerAs } from '@nestjs/config';
const parseBool = (value: string | undefined): boolean =>
  value?.toLowerCase() === 'true';

export default registerAs('Config', () => ({
  Env: process.env.NODE_ENV ?? '',
  Server: {
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
  Logging: {
    Endpoints: {
      LogRequests: parseBool(process.env.LOGGING_ENDPOINTS_LOG_REQUESTS),
      Folder: process.env.LOGGING_ENDPOINTS_FOLDER ?? '',
    },
    InvalidSignins: {
      LogRequests: parseBool(process.env.LOGGING_INVALIDSIGNINS_LOG_REQUESTS),
      Folder: process.env.LOGGING_INVALIDSIGNINS_FOLDER ?? '',
    },
    Exceptions: {
      LogRequests: parseBool(process.env.LOGGING_EXCEPTIONS_LOG_REQUESTS),
      Folder: process.env.LOGGING_EXCEPTIONS_FOLDER ?? '',
    },
  },
}));
