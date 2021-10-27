import { Column, Entity, JoinTable, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Group } from "./group.entity";

export enum GroupPriveleges {
  PLACE_WAGER = 1,
  ADD_BET,
  ADD_USER,
  DELETE_GROUP
}

@Entity("user_group")
export class UserGroup {

  @Column({type: "enum",
  enum: GroupPriveleges})
  priveleges: GroupPriveleges;

  @ManyToOne(() => User, usr => usr.userGroups, { cascade: ['soft-remove', 'insert']})
  @JoinTable()
  user: User;
  @PrimaryColumn({ type: "uuid" })
  user_id: string;

  @ManyToOne(() => Group, grp=> grp.userGroups,  { cascade: ['soft-remove', 'insert']})
  @JoinTable()
  group: Group;
  @PrimaryColumn({ type: "uuid" })
  group_id: string;
}