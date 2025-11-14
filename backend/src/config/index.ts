import 'dotenv/config';

const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000',
];

export const config = {
  env: process.env.NODE_ENV || 'development',
  api: {
    port: parseInt(process.env.PORT || '3000', 10),
    version: process.env.API_VERSION || 'v1',
    cors: {
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
  },
  database: {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'safelogin_db',
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.NODE_ENV !== 'production',
    },
  },
};
