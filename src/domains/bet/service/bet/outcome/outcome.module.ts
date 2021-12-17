import { Module } from '@nestjs/common';
import { OutcomeService } from './outcome.service';

@Module({
  providers: [OutcomeService]
})
export class OutcomeModule {}
