import { CustomBaseEntity } from "../../../CustomBaseEntity";
import { Entity, Column } from 'typeorm';

@Entity()
export class Group extends CustomBaseEntity {
  @Column()
  name: string;
}