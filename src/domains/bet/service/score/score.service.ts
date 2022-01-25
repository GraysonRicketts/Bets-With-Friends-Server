import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../../../../logger/CustomLogger';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserService } from '../../../user/service/user.service';

@Injectable()
export class ScoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly logger: CustomLogger,
  ) {}

  async getScore(userId: string) {
    const usr = await this.userService.findUnique({ id: userId });
    return usr?.score;
  }

  updateScore(userId: string, delta: number) {
    if (delta === 0) {
      this.logger.error('Updating score by 0');
    }

    return this.prisma.user.update({
      data: {
        score: {
          // Increment handles negative deltas
          increment: delta,
        },
        version: {
          increment: 1,
        },
      },
      where: {
        id: userId,
      },
    });
  }
}
