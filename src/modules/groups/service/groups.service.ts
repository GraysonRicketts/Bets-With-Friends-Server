import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomRepository } from '../../../CustomRepository';
import { CustomLogger } from '../../../logger/CustomLogger';
import { Group } from '../entities/group.entity';
import { GroupRepository } from '../entities/group.repository';
import { GroupPriveleges, UserGroup } from '../entities/user-group.entity';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(UserGroup) private readonly userGrpRepo: CustomRepository<UserGroup>,
        private readonly groupRepo: GroupRepository,
        private readonly logger: CustomLogger) {
        this.logger.setContext(GroupsService.name);
    }

    async create(name: string, ownerId: string): Promise<Group> {
        const grp = await this.groupRepo.save({ name, ownerId });
        await this.userGrpRepo.save({ user_id: ownerId, group_id: grp.id, priveleges: GroupPriveleges.DELETE_GROUP })
        return grp;
    }

    findAllForUser(userId: string): Promise<Group[]> {
        return this.groupRepo.findAllForUser(userId);
    }
}
