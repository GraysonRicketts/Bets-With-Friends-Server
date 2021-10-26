import { CustomBaseEntity } from "../../../CustomBaseEntity";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from "../../users/entities/user.entity";
import { uuid } from "../../../types";
import { UserGroup } from "./user-group.entity";

@Entity()
export class Group extends CustomBaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
  @Column({name: 'owner_id', type: "uuid" })
  ownerId: uuid;

  @OneToMany(() => UserGroup, userGroup => userGroup.group_id, {
    cascade: ['insert', 'soft-remove']
  })
  userGroups: UserGroup[];
}