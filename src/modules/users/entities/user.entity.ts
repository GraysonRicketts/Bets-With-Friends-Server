import { CustomBaseEntity } from "../../../CustomBaseEntity";
import { Entity, Column, ManyToMany, OneToMany } from 'typeorm';
import { Group } from "../../groups/entities/group.entity";
import { UserGroup } from "../../groups/entities/user-group.entity";

@Entity()
export class User extends CustomBaseEntity {
  @Column()
  name: string;

  @OneToMany(() => UserGroup, userGroup => userGroup.user_id,  { cascade: ['soft-remove']})
  userGroups: UserGroup[];
}