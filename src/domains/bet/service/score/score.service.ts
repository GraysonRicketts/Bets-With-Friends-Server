import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomLogger } from '../../../../logger/CustomLogger';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserService, UserWithWagerPayload } from '../../../user/service/user.service';

@Injectable()
export class ScoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly logger: CustomLogger,
  ) {}

  async canSubtractScore(userId: string, wager: number): Promise<number> {
    const user = await this.userService.findUnique({ id: userId }, { withWager: true }) as UserWithWagerPayload;
    if (!user) {
      const err = new BadRequestException();
      this.logger.error('Bet does not exist', err.stack, undefined, { userId, wager });
      throw err;
    }

    const { score, wager: wagers } = user;
    const activeWagers = wagers.filter(w => !w.bet.closedAt).map(w => w.amount).reduce((pv, cv) => pv + cv, 0)
    if ((score - wager - activeWagers) < 0) {
        const err = new BadRequestException();
      this.logger.error('Bet does not exist', err.stack, undefined, { userId, wager });
      throw err;
    }

    return user.version;
  }
}
