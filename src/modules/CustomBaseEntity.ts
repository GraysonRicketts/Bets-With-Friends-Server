import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import DateTime from 'luxon';

export abstract class CustomBaseEntity {
    @CreateDateColumn({ type: 'timestamptz'})
    createdAt: DateTime;

    @UpdateDateColumn({ type: 'timestamptz'})
    updatedAt: DateTime;

    @DeleteDateColumn({ type: 'timestamptz'})
    deletedAt?: DateTime;

    @VersionColumn()
    version: string;
}