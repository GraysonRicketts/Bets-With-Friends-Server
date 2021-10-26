import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomRepository } from '../../../CustomRepository';
import { CustomLogger } from '../../../logger/CustomLogger';
import { Group } from '../entities/group.entity';
import { GroupRepository } from '../entities/group.repository';
import { UserGroup } from '../entities/user-group.entity';

@Injectable()
export class GroupsService {
    constructor(
        private readonly groupRepo: GroupRepository,
        private readonly logger: CustomLogger) {
        this.logger.setContext(GroupsService.name);
    }

    async create(name: string, ownerId: string): Promise<Group> {
        return this.groupRepo.save({ name, ownerId });
    }

    findAllForUser(userId: string): Promise<Group[]> {
        return this.groupRepo.findAllForUser(userId);
    }
}
