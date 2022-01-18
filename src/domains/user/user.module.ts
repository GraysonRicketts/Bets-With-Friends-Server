import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { FriendService } from './friend/service/friend.service';
import { FriendController } from './friend/controller/friend.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService, FriendService],
  exports: [UserService],
  controllers: [FriendController],
})
export class UserModule {}
