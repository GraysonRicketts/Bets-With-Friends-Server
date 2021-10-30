import { Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GroupsService {
    constructor(
        private prisma: PrismaService,
        private readonly logger: CustomLogger) {
        this.logger.setContext(GroupsService.name);
    }

    async create(name: string, ownerId: string): Promise<Group> {
        return this.prisma.group.create({data: { name, ownerId }});
    }

    findAllForUser(userId: string): Promise<any[]> {
        return;
    }
}
