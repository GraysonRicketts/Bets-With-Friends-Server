import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomLogger } from '../../../../logger/CustomLogger';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserService, UserWithFriendPayload, baseUser } from '../../service/user.service';

export const baseFriendRequest = Prisma.validator<Prisma.FriendRequestArgs>()({
  select: {
    id: true,
    userTo: {
      select: {
        ...baseUser.select
      }
    },
    userFrom: {
      select: {
        ...baseUser.select
      }
    },
    createdAt: true
  }
});
export type FriendRequest = Prisma.FriendRequestGetPayload<typeof baseFriendRequest>;

export interface FriendRequests {
  to: FriendRequest[];
  from: FriendRequest[];
}

@Injectable()
export class FriendService {
  async getFriendRequestsForUser(userId: string): Promise<FriendRequests> {
    const requests = await this.prisma.friendRequest.findMany({
      ...baseFriendRequest,
      where: {
        userFromId: userId,
        OR: {
          userToId: userId
        }
      }
    })

    const from = requests.filter(r => r.userFrom.id === userId);
    const to = requests.filter(r => r.userTo.id === userId);

    return {
      from,
      to
    }
  }

  getFriendsForUser(userId: string) {
      throw new Error('Method not implemented.');
  }

  constructor(
    private readonly logger: CustomLogger,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(FriendService.name);
  }

  async addFriend(friendEmail: string, userId: string) {
    // Validate user exists
    const user = (await this.userService.findUnique(
      { id: userId },
      { withFriend: true },
    )) as UserWithFriendPayload;
    if (!user) {
      const err = new BadRequestException();
      this.logger.error('User does not exist', err.stack, undefined, {
        friendEmail,
        userId,
      });
      throw err;
    }

    // Validate friend exists
    const friend = (await this.userService.findUnique(
      { email: friendEmail },
      { withFriend: true },
    )) as UserWithFriendPayload;
    if (!friend) {
      const err = new BadRequestException('Your friend does not have an account linked to this email');
      this.logger.error('Friend does not exist', err.stack, undefined, {
        friendEmail,
        userId,
      });
      throw err;
    }

    // Validate user is not friend
    if (user.id === friend.id) {
      throw new BadRequestException('You cannot add yourself as a friend');
    }

    // Validate user and friend aren't already friends
    if (user.friends.find((f) => f.friend.id === friend.id)) {
      const err = new BadRequestException(`You're already friends`);
      this.logger.error(err.message, err.stack, undefined, {
        friendEmail,
        userId,
      });
      throw err;
    }

    // Validate friend request doesn't already exist
    if (user.sentFriendRequests.find((r) => r.userTo.id === friend.id)) {
      const err = new BadRequestException(`You're already friends`);
      this.logger.error(err.message, err.stack, undefined, {
        friendEmail,
        userId,
      });
      throw err;
    }

    // If friend request pending then accept
    const friendReq = user.receivedFriendRequests.find(
      (r) => r.userFrom.id === friend.id,
    );
    if (friendReq) {
      await this.acceptFriendRequest(friendReq.id, userId);
      return;
    }

    // Send friend request to friend
    await this.prisma.friendRequest.create({
      data: {
        userToId: friend.id,
        userFromId: userId,
      },
    });

    return friend;
  }

  async removeFriend(friendId: string, userId: string) {
    // Validate user exists
    const user = (await this.userService.findUnique(
        { id: userId },
        { withFriend: true },
      )) as UserWithFriendPayload;
      if (!user) {
        const err = new BadRequestException();
        this.logger.error('User does not exist', err.stack, undefined, {
            friendId,
          userId,
        });
        throw err;
      }
  
      // Validate user and friend are already friends
      const userFriend = user.friends.find(f => f.friend.id === friendId)
      if (!userFriend) {
        const err = new BadRequestException();
        this.logger.error('Users not friends', err.stack, undefined, {
            friendId,
          userId,
        });
        throw err;
      }

      const friend = await this.userService.findUnique({ id: friendId }, { withFriend: true}) as UserWithFriendPayload;
      const friendFriend = friend.friends.find(f => f.friend.email === user.email)
    if (!friendFriend) {
        throw new InternalServerErrorException('This should never be possible')
    }
    
    // Remove friend
    return this.prisma.friend.deleteMany({ where: {
        id: friendFriend.friend.id,
        OR: {
            id: userFriend.friend.id
        } 
    }})
  }

  async acceptFriendRequest(requestId: string, userId: string) {
    // Validate user exists
    const user = (await this.userService.findUnique(
      { id: userId },
      { withFriend: true },
    )) as UserWithFriendPayload;
    if (!user) {
      const err = new BadRequestException();
      this.logger.error('User does not exist', err.stack, undefined, {
        requestId,
        userId,
      });
      throw err;
    }

    // Validate request exists
    const request = user.receivedFriendRequests.find((r) => r.id === requestId);
    if (!request) {
      const err = new BadRequestException();
      this.logger.error('Request does not exist', err.stack, undefined, {
        requestId,
        userId,
      });
      throw err;
    }

    // Delete request and add as friends
    return this.prisma.$transaction([
        this.prisma.friendRequest.delete({ where: { id: requestId }}),
        this.prisma.friend.createMany({ data: [
            { friendId: userId, friendedId: request.userFrom.id },
            { friendedId: userId, friendId: request.userFrom.id },
        ]})
    ])
  }
}
