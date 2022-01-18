import { BaseBet } from 'src/prisma/bet.prisma';

export const mockBet: BaseBet = Object.freeze({
  title: 'mock',
  category: null,
  closedAt: new Date(),
  closedBy: null,
  groupId: '456',
  id: 'abcd',
  wagers: [],
  options: [],
});
