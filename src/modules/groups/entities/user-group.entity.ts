import { Column, Entity, JoinTable, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Group } from "./group.entity";

@Entity("user_group")
export class UserGroup {

  @Column()
  priveleges: string;

  @ManyToOne(() => User, { cascade: ['soft-remove', 'insert']})
  @JoinTable()
  user: User;
  @PrimaryColumn({ type: "uuid" })
  user_id: number;

  @ManyToOne(() => Group,  { cascade: ['soft-remove', 'insert']})
  @JoinTable()
  group: Group;
  @PrimaryColumn({ type: "uuid" })
  group_id: number;
}