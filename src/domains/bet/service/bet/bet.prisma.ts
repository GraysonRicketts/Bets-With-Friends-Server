import { Prisma } from "@prisma/client";

export const baseBet = Prisma.validator<Prisma.BetArgs>()({
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

  type BaseBet = Prisma.BetGetPayload<typeof baseBet>;