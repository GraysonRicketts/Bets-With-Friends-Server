import { CustomBaseEntity } from "../../../CustomBaseEntity";
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends CustomBaseEntity {
  @Column()
  name: string;
}