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

    // Get the group
    const isMember = await this.groupService.verifyUserIsMemberOfGroup(
      creatorId,
      groupId,
    );

    // Make sure the user is in the group
    if (!isMember) {
      const err = new BadRequestException();
      this.logger.error(
        'Failed verifying user is in group',
        err.stack,
        undefined,
        { ...data },
      );
      throw err;
    }

    
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

    const options = await this.prisma.option.createMany({ data: optionNames.map(o => ({ name: o, betId: bet.id }))})
    const creatorOption = options.find(o => o.name === wagerOption)

    // Create wager
    const wager = await this.prisma.wager.create({ data: {
      betId: bet.id,
      optionId: creatorOption.id,
      amount: wagerAmount,
      userId: creatorId
    }})

    // Find bet with information
    const betWithEveryting = this.prisma.bet.findUnique({
      select: {
        id: true,
        title: true,
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
            
          }
        }
      },
      where: { id: bet.id}
    })
    if (!betWithEveryting) {
      throw new InternalServerErrorException('Should never happen')
    }

    return betWithEveryting
  }
}
