import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  updateScore(userId: string, amount: number) {
    let delta;
    if (amount === 0) {
      this.logger.error('Updating score by 0');
      delta = { score: { decrement: 0 } };
    } else if (amount < 0) {
      delta = { score: { decrement: amount } };
    } else {
      delta = { score: { increment: amount } };
    }

    return this.prisma.user.update({
      data: {
        ...delta,
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
