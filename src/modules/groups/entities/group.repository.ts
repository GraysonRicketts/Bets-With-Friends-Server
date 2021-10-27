import { EntityRepository, QueryBuilder } from 'typeorm';
import { CustomRepository } from '../../../CustomRepository';
import { User } from '../../users/entities/user.entity';
import { Group } from './group.entity';
import { UserGroup } from './user-group.entity';

@EntityRepository(Group)
export class GroupRepository extends CustomRepository<Group> {
  async findAllForUser(userId: string): Promise<Group[]> {
    return this.createQueryBuilder('g')
      .leftJoinAndSelect('g.userGroups', 'ug')
      .leftJoinAndSelect('ug.user', 'u')
    //   .where('u.id = :userId', { userId })
      .getMany();
  }
}
