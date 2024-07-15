import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [UserModule, DatabaseModule, HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
