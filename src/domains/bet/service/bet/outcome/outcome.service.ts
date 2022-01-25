import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseBet } from 'src/prisma/bet.prisma';

interface Outcome {
  userId: string;
  delta: number;
}

@Injectable()
export class OutcomeService {
  calculateOutcomes(bet: BaseBet): Record<string, Outcome> {
    const winningOption = bet.options.find((o) => o.isFinalOption);
    if (!winningOption) {
      throw new InternalServerErrorException('Expected winning option');
    }

    // Find winners
    const winningWagers = bet.wagers.filter(
      (w) => w.option.id === winningOption.id,
    );

    // Sum pool
    const pool = bet.wagers.map((w) => w.amount).reduce((pv, cv) => pv + cv, 0);
    const winnersPool = winningWagers
      .map((w) => w.amount)
      .reduce((pv, cv) => pv + cv, 0);
    const losersPool = pool - winnersPool;

    // If everyone is a winner there is no change
    if (winnersPool === pool) {
      return bet.wagers.reduce(
        (pv, cv) => ({ ...pv, [cv.user.id]: { userId: cv.user.id, delta: 0 } }),
        {},
      );
    }

    // If everyone is wrong the house wins
    if (losersPool === pool) {
      return bet.wagers.reduce(
        (pv, cv) => ({
          ...pv,
          [cv.user.id]: { userId: cv.user.id, delta: cv.amount * -1 },
        }),
        {},
      );
    }

    // Winners win their proportion of the losers pool
    // Losers lose all of their wager
    return bet.wagers.reduce((pv, cv) => {
      const isWinner = cv.option.id === winningOption.id;
      let delta = 0;
      const wager = cv.amount;
      if (isWinner) {
        const proportionWinningPool = wager / winnersPool;
        delta = proportionWinningPool * losersPool;
      } else {
        delta = -1 * wager;
      }
      return {
        ...pv,
        [cv.user.id]: { userId: cv.user.id, delta },
      };
    }, {});
  }
}
