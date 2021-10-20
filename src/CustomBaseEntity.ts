import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import DateTime from 'luxon';
import { uuid } from "./types";

export abstract class CustomBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: uuid;

    @CreateDateColumn({ type: 'timestamptz'})
    createdAt: DateTime;

    @UpdateDateColumn({ type: 'timestamptz'})
    updatedAt: DateTime;

    @DeleteDateColumn({ type: 'timestamptz'})
    deletedAt?: DateTime;

    @VersionColumn()
    version: string;
}