import { Injectable } from '@nestjs/common';
import { diff } from 'deep-object-diff';

@Injectable()
export class AuditSubscriber {
  // constructor(
  //   private readonly auditRepository: Repository<Audit>,
  //   private readonly connection: Connection
  // ) {
  //   this.connection.subscribers.push(this);
  // }
  // /**
  //  * Called after entity insertion.
  //  */
  // afterInsert(event: InsertEvent<any>) {
  //   if (event.metadata.name === 'Audit') {
  //     return;
  //   }
  //   this.auditRepository.save({ diff: event.entity });
  // }
  // /**
  //  * Called after entity update.
  //  */
  // afterUpdate(event: UpdateEvent<any>) {
  //   if (event.metadata.name === 'Audit') {
  //     return;
  //   }
  //   const originalObj = event.databaseEntity;
  //   const newObj = event.entity;
  //   this.auditRepository.save({
  //     before: originalObj,
  //     diff: diff(originalObj, newObj),
  //   });
  // }
  // /**
  //  * Called after entity removal.
  //  */
  // afterRemove(event: RemoveEvent<any>) {
  //   if (event.metadata.name === 'Audit') {
  //     return;
  //   }
  //   this.auditRepository.save({ before: event.entity });
  // }
}
