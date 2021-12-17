import { Prisma } from '@prisma/client';

export const baseWager = Prisma.validator<Prisma.WagerArgs>()({
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
        version: true,
      },
    },
  },
});

export const baseBet = Prisma.validator<Prisma.BetArgs>()({
  select: {
    id: true,
    title: true,
    groupId: true,
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    options: {
      select: {
        name: true,
        id: true,
        isFinalOption: true,
      },
    },
    closedAt: true,
    closedBy: {
      select: {
        id: true,
        displayName: true,
      },
    },
    wagers: baseWager,
  },
});

export type BaseBet = Prisma.BetGetPayload<typeof baseBet>;
