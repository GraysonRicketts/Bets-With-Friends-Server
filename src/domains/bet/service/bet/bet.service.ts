import { Category, PrismaPromise } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomLogger } from 'src/logger/CustomLogger';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupService } from '../../../group/service/group.service';
import { CategoryService } from '../category/category.service';
import { ScoreService } from '../score/score.service';
import { DateTime } from 'luxon';
import { baseBet, baseWager } from 'src/prisma/bet.prisma';
import { OutcomeService } from './outcome/outcome.service';

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

@Injectable()
export class BetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupService: GroupService,
    private readonly categoryService: CategoryService,
    private readonly scoreService: ScoreService,
    private readonly logger: CustomLogger,
    private readonly outcomeService: OutcomeService,
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

    await this.validateIsMemberOfGroup(creatorId, groupId);

    const betData: { title: string; groupId: string; categoryId?: string } = {
      title,
      groupId,
    };
    let category: Category | undefined;
    if (categoryName) {
      category =
        (await this.categoryService.findByName(categoryName, groupId)) ||
        undefined;

      if (!category) {
        category = await this.categoryService.create(categoryName, groupId);
      }

      betData.categoryId = category.id;
    }

    const bet = await this.prisma.bet.create({
      data: betData,
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
      throw err;
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

    await this.validateIsMemberOfGroup(creatorId, bet.groupId);

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

    return this.prisma.wager.create({
      data: {
        betId,
        userId: creatorId,
        optionId,
        amount,
      },
      select: baseWager.select,
    });
  }

  async findForGroup(params: { groupId: string; userId: string }) {
    const { userId, groupId } = params;

    await this.validateIsMemberOfGroup(userId, groupId);

    return this.prisma.bet.findMany({
      ...baseBet,
      where: {
        AND: {
          groupId,
          deletedAt: null,
        },
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

    await this.validateIsMemberOfGroup(userId, bet.groupId);
    const winningOption = bet.options.find((o) => o.id === winningOptionId);
    if (!winningOption) {
      const err = new BadRequestException();
      this.logger.error('Invalid winning option', err.stack, undefined, {
        userId,
        betId,
        winningOptionId,
      });
      throw err;
    }
    winningOption.isFinalOption = true;

    const outcomes = this.outcomeService.calculateOutcomes(bet);
    const scoresToUpdate = Object.entries(outcomes).filter(
      (os) => os[1].delta !== 0,
    );
    const updates = scoresToUpdate.map(([id, o]) =>
      this.scoreService.updateScore(id, o.delta),
    );

    // Transactionalize updates and closing bet
    await this.prisma.$transaction([
      ...updates,
      ...this.closeBet(bet.id, userId, winningOptionId),
    ]);

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

  async getBet(betId: string) {
    const bet = await this.prisma.bet.findUnique({
      ...baseBet,
      where: { id: betId },
    });
    if (!bet) {
      const err = new BadRequestException();
      this.logger.error('Bet does not exist', err.stack, undefined);
      throw err;
    }

    return bet;
  }

  private async validateIsMemberOfGroup(userId: string, groupId: string) {
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

  async delete(id: string, userId?: string) {
    const bet = await this.getBet(id);

    const usersWhoWagered = bet.wagers.map((w) => w.user);
    const user = usersWhoWagered.find((u) => u.id === userId);
    if (userId && !user) {
      this.logger.error('Not authorized to delete bet');
      throw new BadRequestException();
    }

    const nowIso = new Date().toISOString();
    await this.prisma.$transaction([
      this.prisma.bet.update({
        data: {
          deletedAt: nowIso,
        },
        where: {
          id,
        },
      }),
      this.prisma.wager.updateMany({
        data: {
          deletedAt: nowIso,
        },
        where: {
          betId: id,
        },
      }),
      this.prisma.option.updateMany({
        data: {
          deletedAt: nowIso,
        },
        where: {
          betId: id,
        },
      }),
    ]);
  }
}
