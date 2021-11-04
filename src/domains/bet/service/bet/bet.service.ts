import { Category, Prisma } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomLogger } from '../../../../logger/CustomLogger';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GroupService } from '../../../group/service/group.service';
import { CategoryService } from '../category/category.service';

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
    option: {
      select: {
        name: true,
        id: true,
      },
    },
    wager: {
      select: {
        amount: true,
        option: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            displayName: true
          }
        }
      }
    }
}})

@Injectable()
export class BetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupService: GroupService,
    private readonly categoryService: CategoryService,
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
      category = await this.categoryService.findByName(categoryName, groupId) || undefined;

      if (!category) {
        category = await this.categoryService.create(categoryName, groupId);
      }
    }

    const bet = await this.prisma.bet.create({
      data: {
        title,
        groupId,
        categoryId: category?.id
      }
    });

    await this.prisma.option.createMany({ data: optionNames.map(o => ({ name: o, betId: bet.id }))})
    const creatorOptions = await this.prisma.option.findMany({ select: {
      id: true
    }, where: {
      name: wagerOption,
      betId: bet.id 
    }})
    if (creatorOptions.length !== 1) {
      const err = new InternalServerErrorException('This should never happen');
      this.logger.error(err.message, err.stack, undefined, { creatorOptions: creatorOptions.map(c => c.id) })
    }

    // Create wager
    await this.prisma.wager.create({ data: {
      betId: bet.id,
      optionId: creatorOptions[0].id,
      amount: wagerAmount,
      userId: creatorId
    }})

    // Find bet with information
    const betWithEveryting = this.prisma.bet.findUnique({
      ...baseBet,
      where: { id: bet.id}
    })
    if (!betWithEveryting) {
      throw new InternalServerErrorException('Should never happen')
    }

    return betWithEveryting
  }

  async placeWager(data: PlaceWagerData) {
    const { creatorId, betId, optionId, amount } = data;

    const bet = await this.prisma.bet.findUnique({ ...baseBet, where: { id: betId } });
    if (!bet) {
      const err = new BadRequestException();
      this.logger.error(
        'Bet does not exist',
        err.stack,
        undefined,
        { ...data },
      );
      throw err;
    }

    if (!bet.groupId) {
      const err = new InternalServerErrorException();
      this.logger.error(
        'Should always have groupId',
        err.stack,
        undefined,
        { ...data },
      );
      throw err;
    }
    await this.validateIsMember(creatorId, bet.groupId)

    if (!bet.option.find(o => o.id === optionId)) {
      const err = new BadRequestException();
      this.logger.error(
        'Option does not exist',
        err.stack,
        undefined,
        { ...data, options: bet.option.map(o => o.id) },
      );
      throw err;
    }

    if (bet.wager.find(w =>  w.user.id === creatorId)) {
      const err = new BadRequestException();
      this.logger.error(
        'User already placed wager',
        err.stack,
        undefined,
        { ...data },
      );
      throw err;
    }

    return this.prisma.wager.create({data: {
      betId,
      userId: creatorId,
      optionId,
      amount
    }, select: {
      id: true,
      betId: true,
      optionId: true
    }})
  }

  async findForGroup(params: {groupId: string, userId: string}) {
    const { userId, groupId } = params;

    await this.validateIsMember(userId, groupId)

    return this.prisma.bet.findMany({
      ...baseBet,
      where: {
        groupId
      }
    })
  }

  private async validateIsMember(userId: string, groupId: string) {
    const isMember = await this.groupService.isMemberOfGroup(
      userId,
      groupId,
    );

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
