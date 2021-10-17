import { CustomBaseEntity } from "src/modules/CustomBaseEntity";
import { uuid } from "src/types";
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: uuid;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;
}