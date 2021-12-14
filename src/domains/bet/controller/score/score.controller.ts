import {
  Controller,
  Get,
  NotFoundException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ScoreService } from '../../service/score/score.service';

@UseGuards(JwtAuthGuard)
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  async get(@Request() req) {
    const userId = req.user.id;

    const score = await this.scoreService.getScore(userId);
    if (!score) {
      throw new NotFoundException();
    }
    return score;
  }
}
