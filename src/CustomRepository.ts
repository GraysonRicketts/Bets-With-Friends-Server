import { Repository } from "typeorm";

export class CustomRepository<T> extends Repository<T> {
    constructor() {
        super();
    }

    /** @deprecated - DO NOT USE - use `find` instead */
    findOne(p: any) {
        return super.findOne(p);
    }

    /** @deprecated - DO NOT USE - use `find` instead */
    findOneOrFail(p: any) {
        return super.findOne(p);
    }

    /** @deprecated - DO NOT USE - use `save` instead */
    insert(p: any) {
        return super.insert(p);
    }

    delete(p: any) {
        return super.softDelete(p);
    }

    remove(p: any) {
        return super.softRemove(p);
    }
}