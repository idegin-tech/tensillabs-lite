import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    port: configService.get<number>('DATABASE_PORT', 5432),
    username: configService.get<string>('DATABASE_USER', 'postgres'),
    password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
    database: configService.get<string>('DATABASE_NAME', 'tensillabs_lite'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: !isProduction,
    logging: !isProduction,
    retryAttempts: isProduction ? 5 : 3,
    retryDelay: isProduction ? 2000 : 1000,
    autoLoadEntities: true,
    poolSize: isProduction ? 10 : 5,
  };

  console.log(
    `Connecting to PostgreSQL: ${config.username}@${config.host}:${config.port}/${config.database}`,
  );

  return config;
};
