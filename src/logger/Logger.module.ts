import { Module } from "@nestjs/common";
import { CustomLogger } from "./CustomLogger";

@Module({
    providers: [CustomLogger],
    exports: [CustomLogger],
  })
  export class LoggerModule {}