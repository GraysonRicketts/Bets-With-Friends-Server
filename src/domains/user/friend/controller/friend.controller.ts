import { Body, Controller, Post, Request } from '@nestjs/common';
import { AddFriendDto } from '../dto/add-friend.dto';
import { FriendService } from '../service/friend.service';

@Controller('friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @Post()
    async addFriend(@Body() body: AddFriendDto, @Request() req) {
        const user = req.user;
        const friendEmail = body.email;

        return await this.friendService.addFriend(friendEmail, user.id);
    }
}
