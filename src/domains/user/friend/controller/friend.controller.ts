import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/guard/jwt-auth.guard';
import { AddFriendDto } from '../dto/add-friend.dto';
import { FriendService } from '../service/friend.service';

@UseGuards(JwtAuthGuard)
@Controller('friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @Post()
    async addFriend(@Body() body: AddFriendDto, @Request() req) {
        const user = req.user;
        const friendEmail = body.email;

        return await this.friendService.addFriend(friendEmail, user.id);
    }

    // @Get()
    // async getFriends(@Request() req) {
    //     const user = req.user;

    //     return await this.friendService.getFriendsForUser(user.id);
    // }

    @Get('/requests')
    async getFriendRequests(@Request() req) {
        const user = req.user;

        return await this.friendService.getFriendRequestsForUser(user.id);
    }
}
