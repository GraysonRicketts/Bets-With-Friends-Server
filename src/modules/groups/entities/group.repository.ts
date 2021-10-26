import { EntityRepository, QueryBuilder } from "typeorm";
import { CustomRepository } from "../../../CustomRepository";
import { User } from "../../users/entities/user.entity";
import { Group } from "./group.entity";
import { UserGroup } from "./user-group.entity";

@EntityRepository(Group)
export class GroupRepository extends CustomRepository<Group> {
    
    async findAllForUser(userId: string): Promise<Group[]> {
        const response = await this.createQueryBuilder('g')
        .leftJoinAndSelect(UserGroup, 'ug', 'g.id = ug.group_id')
        .leftJoinAndSelect(User, 'u', 'ug.user_id = u.id')
        .where('u.id = :userId', { userId });

        console.log(response.getSql())

        return response.getMany();
    }
}