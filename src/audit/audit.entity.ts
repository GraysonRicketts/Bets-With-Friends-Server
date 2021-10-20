import { Column, Entity } from "typeorm";
import { CustomBaseEntity } from "../CustomBaseEntity";

@Entity()
export class Audit extends CustomBaseEntity {
    @Column({ type: 'jsonb', nullable: true })
    before?: Object;

    @Column({ type: 'jsonb', nullable: true })
    diff?: Object;
}