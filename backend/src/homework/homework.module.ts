import { Module } from "@nestjs/common";
import { HomeworkController } from "./homework.controller";
import { HomeworkService } from "./homework.service";
import { DatabaseModule } from "@/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [HomeworkController],
  providers: [HomeworkService],
})
export class HomeworkModule {}
