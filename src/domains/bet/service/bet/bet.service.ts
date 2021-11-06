import { Category, Prisma, PrismaPromise } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomLogger } from '../../../../logger/CustomLogger';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GroupService } from '../../../group/service/group.service';
import { CategoryService } from '../category/category.service';
import { ScoreService } from '../score/score.service';
import { DateTime } from 'luxon';

interface CreateBetData {
  creatorId: string;
  groupId: string;
  title: string;
  options: string[];
  category?: string;
  wagerOption: string;
  wagerAmount: number;
}

interface PlaceWagerData {
  creatorId: string;
  betId: string;
  optionId: string;
  amount: number;
}

const baseBet = Prisma.validator<Prisma.BetArgs>()({
  select: {
    id: true,
    title: true,
    groupId: true,
    category: {
      select: {
        name: true,
      },
    },
    options: {
      select: {
        name: true,
        id: true,
      },
    },
    wagers: {
      select: {
        id: true,
        amount: true,
        option: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            displayName: true,
            version: true
          },
        },
      },
    },
  },
});
type BaseBet = Prisma.UserGetPayload<typeof baseBet>;

@Injectable()
export class BetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupService: GroupService,
    private readonly categoryService: CategoryService,
    private readonly scoreService: ScoreService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(BetService.name);
  }

  async create(data: CreateBetData) {
    const {
      groupId,
      creatorId,
      title,
      options: optionNames,
      category: categoryName,
      wagerOption,
      wagerAmount,
    } = data;

    await this.validateIsMember(creatorId, groupId);

    let category: Category | undefined;
    if (categoryName) {
      category =
        (await this.categoryService.findByName(categoryName, groupId)) ||
        undefined;

      if (!category) {
        category = await this.categoryService.create(categoryName, groupId);
      }
    }

    const bet = await this.prisma.bet.create({
      data: {
        title,
        groupId,
        categoryId: category?.id,
      },
    });

    await this.prisma.option.createMany({
      data: optionNames.map((o) => ({ name: o, betId: bet.id })),
    });
    const creatorOptions = await this.prisma.option.findMany({
      select: {
        id: true,
      },
      where: {
        name: wagerOption,
        betId: bet.id,
      },
    });
    if (creatorOptions.length !== 1) {
      const err = new InternalServerErrorException('This should never happen');
      this.logger.error(err.message, err.stack, undefined, {
        creatorOptions: creatorOptions.map((c) => c.id),
      });
    }

    // Create wager
    await this.prisma.wager.create({
      data: {
        betId: bet.id,
        optionId: creatorOptions[0].id,
        amount: wagerAmount,
        userId: creatorId,
      },
    });

    // Find bet with information
    const betWithEveryting = this.prisma.bet.findUnique({
      ...baseBet,
      where: { id: bet.id },
    });
    if (!betWithEveryting) {
      throw new InternalServerErrorException('Should never happen');
    }

    return betWithEveryting;
  }

  async placeWager(data: PlaceWagerData) {
    const { creatorId, betId, optionId, amount } = data;
    const bet = await this.getBet(betId);

    await this.validateIsMember(creatorId, bet.groupId);

    if (!bet.options.find((o) => o.id === optionId)) {
      const err = new BadRequestException();
      this.logger.error('Option does not exist', err.stack, undefined, {
        ...data,
        options: bet.options.map((o) => o.id),
      });
      throw err;
    }

    if (bet.wagers.find((w) => w.user.id === creatorId)) {
      const err = new BadRequestException();
      this.logger.error('User already placed wager', err.stack, undefined, {
        ...data,
      });
      throw err;
    }

    await this.scoreService.canSubtractScore(creatorId, amount);
    return this.prisma.wager.create({
      data: {
        betId,
        userId: creatorId,
        optionId,
        amount,
      },
      select: {
        id: true,
        betId: true,
        optionId: true,
      },
    });
  }

  async findForGroup(params: { groupId: string; userId: string }) {
    const { userId, groupId } = params;

    await this.validateIsMember(userId, groupId);

    return this.prisma.bet.findMany({
      ...baseBet,
      where: {
        groupId,
      },
    });
  }

  async finalizeBet(params: {
    betId: string;
    userId: string;
    winningOptionId: string;
  }) {
    const { betId, userId, winningOptionId } = params;
    const bet = await this.getBet(betId);

    await this.validateIsMember(userId, bet.groupId);
    if (!bet.options.find((o) => o.id === winningOptionId)) {
      const err = new BadRequestException();
      this.logger.error('Invalid winning option', err.stack, undefined, {
        userId,
        betId,
        winningOptionId,
      });
      throw err;
    }

    // Find winners
    const winningWagers = bet.wagers.filter(
      (w) => w.option.id === winningOptionId,
    );
    
    // Sum pool
    const pool = bet.wagers.map(w => w.amount).reduce((pv, cv) => pv + cv, 0);
    const winnersPool = winningWagers.map(w => w.amount).reduce((pv, cv) => pv + cv, 0);
    
    // If there are winners and not everyone is a winner
    const updates: PrismaPromise<any>[] = []
    if (winnersPool > 0 && winnersPool < pool) {
      const losersPool = pool - winnersPool;

      // Add score to users
      updates.push(...winningWagers.map(w => {
        const poolShare = (w.amount / winnersPool) * losersPool;
        return this.prisma.user.updateMany({ data: {
          score: {
            increment: poolShare
          },
          version: {
            increment: 1
          }
        }, where: {
          id: w.user.id,
          version: w.user.version
        }})
      }))

      // Remove score from users
      const losingWagers = bet.wagers.filter(w => !winningWagers.find(ww => ww.id !== w.id))
      updates.push(...losingWagers.map(w => {
        return this.prisma.user.updateMany({ data: {
          score: {
            decrement: w.amount
          },
          version: {
            increment: 1
          }
        }, where: {
          id: w.user.id,
          version: w.user.version
        }})
      }))
    }
    
    // Transactionalize updates and closing bet
    await this.prisma.$transaction([...updates, ...this.closeBet(bet.id, userId, winningOptionId)]);

    // Get updated bet
    return this.getBet(bet.id);
  }
  private closeBet(
    betId: string,
    userId: string,
    winningOptionId: string,
  ): PrismaPromise<any>[] {
    const now = DateTime.now().toISO();
    return [
      this.prisma.option.update({
        data: {
          isFinalOption: true,
        },
        where: {
          id: winningOptionId,
        },
      }),
      this.prisma.bet.update({
        data: { closedAt: now, closedById: userId },
        where: {
          id: betId,
        },
      }),
    ];
  }

  private async getBet(betId: string, ...data) {
    const bet = await this.prisma.bet.findUnique({
      ...baseBet,
      where: { id: betId },
    });
    if (!bet) {
      const err = new BadRequestException();
      this.logger.error('Bet does not exist', err.stack, undefined, { data });
      throw err;
    }

    return bet;
  }

  private async validateIsMember(userId: string, groupId?: string | null) {
    if (!groupId) {
      const err = new InternalServerErrorException();
      this.logger.error('Should always have groupId', err.stack, undefined, {
        userId,
      });
      throw err;
    }

    const isMember = await this.groupService.isMemberOfGroup(userId, groupId);

    // Make sure the user is in the group
    if (!isMember) {
      const err = new BadRequestException();
      this.logger.error(
        'Failed verifying user is in group',
        err.stack,
        undefined,
        { userId, groupId },
      );
      throw err;
    }
  }
}