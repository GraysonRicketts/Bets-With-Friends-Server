import { Test, TestingModule } from '@nestjs/testing';
import { mockBet } from 'test/mocks/Bet.mock';
import { BaseBet } from 'src/prisma/bet.prisma';
import { OutcomeService } from './outcome.service';

const user1 = {
  id: '1',
  displayName: '1',
  version: 1,
};
const user2 = {
  id: '2',
  displayName: '2',
  version: 2,
};
const user3 = {
  id: '3',
  displayName: '3',
  version: 3,
};

const yesOp = {
  id: '1',
  name: 'yes',
  isFinalOption: false,
};
const noOp = {
  id: '2',
  name: 'no',
  isFinalOption: false,
};

describe('OutcomeService', () => {
  let service: OutcomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutcomeService],
    }).compile();

    service = module.get<OutcomeService>(OutcomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#calculateOutcome', () => {
    it('should be negative delta for everyone if no one wins', () => {
      const b: BaseBet = {
        ...mockBet,
        wagers: [
          {
            id: 'y1',
            amount: 20,
            option: yesOp,
            user: user1,
          },
          { id: 'y2', amount: 20, option: yesOp, user: user2 },
        ],
        options: [yesOp, { ...noOp, isFinalOption: true }],
      };

      const o = service.calculateOutcomes(b);

      expect(o[user1.id].delta).toEqual(-20);
      expect(o[user2.id].delta).toEqual(-20);
    });

    it('should be no change in delta for everyone if everyone wins', () => {
      const b: BaseBet = {
        ...mockBet,
        wagers: [
          {
            id: 'y1',
            amount: 20,
            option: yesOp,
            user: user1,
          },
          { id: 'y2', amount: 20, option: yesOp, user: user2 },
        ],
        options: [noOp, { ...yesOp, isFinalOption: true }],
      };

      const o = service.calculateOutcomes(b);

      expect(o[user1.id].delta).toEqual(0);
      expect(o[user2.id].delta).toEqual(0);
    });

    it('should be positive delta for winner and negative delta for loser', () => {
      const b: BaseBet = {
        ...mockBet,
        wagers: [
          {
            id: 'y1',
            amount: 20,
            option: yesOp,
            user: user1,
          },
          { id: 'y2', amount: 20, option: noOp, user: user2 },
        ],
        options: [noOp, { ...yesOp, isFinalOption: true }],
      };

      const o = service.calculateOutcomes(b);

      expect(o[user1.id].delta).toEqual(20);
      expect(o[user2.id].delta).toEqual(-20);
    });

    it('should be positive deltas for winners and negative delta for loser', () => {
      const b: BaseBet = {
        ...mockBet,
        wagers: [
          {
            id: 'y1',
            amount: 20,
            option: yesOp,
            user: user1,
          },
          { id: 'y2', amount: 20, option: yesOp, user: user2 },
          { id: 'y3', amount: 20, option: noOp, user: user3 },
        ],
        options: [noOp, { ...yesOp, isFinalOption: true }],
      };

      const o = service.calculateOutcomes(b);

      expect(o[user1.id].delta).toEqual(10);
      expect(o[user2.id].delta).toEqual(10);
      expect(o[user3.id].delta).toEqual(-20);
    });

    it('should be postive delta for winner and negative deltas for losers', () => {
      const b: BaseBet = {
        ...mockBet,
        wagers: [
          {
            id: 'y1',
            amount: 20,
            option: yesOp,
            user: user1,
          },
          { id: 'y2', amount: 20, option: yesOp, user: user2 },
          { id: 'y3', amount: 20, option: noOp, user: user3 },
        ],
        options: [yesOp, { ...noOp, isFinalOption: true }],
      };

      const o = service.calculateOutcomes(b);

      expect(o[user1.id].delta).toEqual(-20);
      expect(o[user2.id].delta).toEqual(-20);
      expect(o[user3.id].delta).toEqual(40);
    });
  });
});
