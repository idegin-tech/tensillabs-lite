import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeds/seeder.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const seederService = app.get(SeederService);

    const environment = (process.argv[2] || 'development') as
        | 'development'
        | 'production';

    if (!['development', 'production'].includes(environment)) {
        console.error(
            'Invalid environment. Use "development" or "production" (default: development)',
        );
        process.exit(1);
    }

    console.log(`\n🌱 Running ${environment} seeds...\n`);

    try {
        await seederService.seed(environment);
        console.log('\n✅ Seeding completed successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

bootstrap();
