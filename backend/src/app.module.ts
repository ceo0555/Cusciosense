import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SchoolsModule } from "./schools/schools.module";
import { ClassesModule } from "./classes/classes.module";
import { HomeworkModule } from "./homework/homework.module";
import { DatabaseModule } from "./database/database.module";
import { validate } from "./config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 120,
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    SchoolsModule,
    ClassesModule,
    HomeworkModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
