import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeds/seeder.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const seederService = app.get(SeederService);

    console.log('\n🌱 Running APP_KEY-based seeds...\n');

    try {
        await seederService.seedFromAppKey();
        console.log('\n✅ Seeding completed successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

bootstrap();
