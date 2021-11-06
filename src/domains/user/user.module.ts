import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { FriendService } from './friend/friend.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService, FriendService],
  exports: [UserService]
})
export class UserModule {}
