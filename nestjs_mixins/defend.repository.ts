import {
    DeepPartial,
    DeleteResult,
    EntityManager,
    EntityMetadata,
    FindConditions,
    FindManyOptions,
    FindOneOptions,
    InsertResult,
    ObjectID,
    QueryRunner,
    RemoveOptions,
    Repository,
    SaveOptions,
    SelectQueryBuilder,
    UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';


export default class DefendRepository<T> implements Repository<T> {

    constructor(private readonly impl: Repository<T>) {

    }

    get manager(): EntityManager { return this.impl.manager }
    get metadata(): EntityMetadata { return this.impl.metadata }
    get queryRunner(): QueryRunner | undefined { return this.impl.queryRunner }
    get target(): string | Function { return this.impl.target }
    createQueryBuilder(alias?: string | undefined, queryRunner?: QueryRunner | undefined): SelectQueryBuilder<T> {
        return this.impl.createQueryBuilder(alias, queryRunner);
    }

    hasId(entity: T): boolean {
        return this.impl.hasId(entity)
    }
    getId(entity: T) {
        return this.impl.getId(entity)
    }
    merge(mergeIntoEntity: T, ...entityLikes: DeepPartial<T>[]): T {
        return this.impl.merge(mergeIntoEntity, ...entityLikes)
    }
    preload(entityLike: DeepPartial<T>): Promise<T | undefined> {
        return this.impl.preload(entityLike)
    }
    query(query: string, parameters?: any[] | undefined): Promise<any> {
        return this.impl.query(query, parameters)
    }
    clear(): Promise<void> {
        return this.impl.clear()
    }
    increment(conditions: FindConditions<T>, propertyPath: string, value: string | number): Promise<UpdateResult> {
        return this.impl.increment(conditions, propertyPath, value)
    }
    decrement(conditions: FindConditions<T>, propertyPath: string, value: string | number): Promise<UpdateResult> {
        return this.impl.decrement(conditions, propertyPath, value)
    }


    create(): T;
    create(entityLikeArray: DeepPartial<T>[]): T[];
    create(entityLike: DeepPartial<T>): T;
    create(entityLike?: any) {
        if (!entityLike) {
            return this.impl.create()
        }
        return this.impl.create(entityLike)
    }


    save<T extends DeepPartial<T>>(entities: T[], options: SaveOptions & { reload: false; }): Promise<T[]>;
    save<T extends DeepPartial<T>>(entities: T[], options?: SaveOptions | undefined): Promise<(T & T)[]>;
    save<T extends DeepPartial<T>>(entity: T, options: SaveOptions & { reload: false; }): Promise<T>;
    save<T extends DeepPartial<T>>(entity: T, options?: SaveOptions | undefined): Promise<T & T>;
    save(entity: T | T[], options?: any) {
        if (Array.isArray(entity)) {
            return this.impl.save(entity, options)
        } else {
            return this.impl.save(entity, options)
        }
    }

    remove(entities: T[], options?: RemoveOptions): Promise<T[]>;
    remove(entity: T, options?: RemoveOptions): Promise<T>;
    remove(entities: T | T[], options?: any) {
        if (!Array.isArray(entities)) {
            return this.impl.remove(entities, options)
        } else {
            return this.impl.remove(entities, options)
        }
    }

    insert(entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]): Promise<InsertResult> {
        return this.impl.insert(entity);
    }
    update(criteria: string | number | string[] | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
        return this.impl.update(criteria, partialEntity);
    }
    delete(criteria: string | number | string[] | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>): Promise<DeleteResult> {
        return this.impl.delete(criteria);
    }

    count(options?: FindManyOptions<T> | undefined): Promise<number>;
    count(conditions?: FindConditions<T> | undefined): Promise<number>;
    count(conditions?: any) {
        return this.impl.count(conditions);
    }

    find(options?: FindManyOptions<T> | undefined): Promise<T[]>;
    find(conditions?: FindConditions<T> | undefined): Promise<T[]>;
    find(conditions?: any) {
        return this.impl.find(conditions)
    }

    findAndCount(options?: FindManyOptions<T> | undefined): Promise<[T[], number]>;
    findAndCount(conditions?: FindConditions<T> | undefined): Promise<[T[], number]>;
    findAndCount(conditions?: any) {
        return this.impl.findAndCount(conditions)
    }

    findByIds(ids: any[], options?: FindManyOptions<T> | undefined): Promise<T[]>;
    findByIds(ids: any[], conditions?: FindConditions<T> | undefined): Promise<T[]>;
    findByIds(ids: any, conditions?: any) {
        return this.impl.findByIds(ids, conditions)
    }

    findOne(id?: string | number | Date | ObjectID | undefined, options?: FindOneOptions<T> | undefined): Promise<T | undefined>;
    findOne(options?: FindOneOptions<T> | undefined): Promise<T | undefined>;
    findOne(conditions?: FindConditions<T> | undefined, options?: FindOneOptions<T> | undefined): Promise<T | undefined>;
    findOne(conditions?: any, options?: any) {
        return this.impl.findOne(conditions, options)
    }

    findOneOrFail(id?: string | number | Date | ObjectID | undefined, options?: FindOneOptions<T> | undefined): Promise<T>;
    findOneOrFail(options?: FindOneOptions<T> | undefined): Promise<T>;
    findOneOrFail(conditions?: FindConditions<T> | undefined, options?: FindOneOptions<T> | undefined): Promise<T>;
    findOneOrFail(conditions?: any, options?: any) {
        return this.impl.findOneOrFail(conditions, options)
    }

    softRemove<T extends DeepPartial<T>>(entities: T[], options: SaveOptions & { reload: false; }): Promise<T[]>;
    softRemove<T extends DeepPartial<T>>(entities: T[], options?: SaveOptions): Promise<(T & T)[]>;
    softRemove<T extends DeepPartial<T>>(entity: T, options: SaveOptions & { reload: false; }): Promise<T>;
    softRemove<T extends DeepPartial<T>>(entity: T, options?: SaveOptions): Promise<T & T>;
    softRemove(entity: any, options?: any) {
        return this.impl.softRemove(entity, options);
    }

    recover<T extends DeepPartial<T>>(entities: T[], options: SaveOptions & { reload: false; }): Promise<T[]>;
    recover<T extends DeepPartial<T>>(entities: T[], options?: SaveOptions): Promise<(T & T)[]>;
    recover<T extends DeepPartial<T>>(entity: T, options: SaveOptions & { reload: false; }): Promise<T>;
    recover<T extends DeepPartial<T>>(entity: T, options?: SaveOptions): Promise<T & T>;
    recover(entity: any, options?: any) {
        return this.impl.recover(entity, options);
    }

    softDelete(criteria: string | number | FindConditions<T> | string[] | number[] | Date | Date[] | ObjectID | ObjectID[]): Promise<UpdateResult> {
        return this.impl.softDelete(criteria);
    }

    restore(criteria: string | number | FindConditions<T> | string[] | number[] | Date | Date[] | ObjectID | ObjectID[]): Promise<UpdateResult> {
        return this.impl.restore(criteria);
    }
}