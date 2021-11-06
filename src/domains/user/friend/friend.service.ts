import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../../../logger/CustomLogger';

@Injectable()
export class FriendService {
    constructor(private readonly logger: CustomLogger) {
        this.logger.setContext(FriendService.name);
    }

    addFriend(friendEmail: string, userId: string) {
        // Validate user exists
        // Validate friend exists
        // Validate user and friend aren't already friends
        
        // Send friend request to friend
    }

    removeFriend(friendId: string, userId: string) {
        // Validate user exists
        // Validate friend exists
        // Validate user and friend are already friends

        // Remove friend
    }

    acceptFriendRequest(requestId: string, userId: string) {
        // Validate user exists
        // Validate request exists
        // Validate user is receipient of request

        // Delete request
        // Add as friends
    }
}
