import { Inject, mixin } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DefendOrmService } from './defend.orm.service';

export function DefendService<T extends new (...args: any[]) => any>(
    entityClass: T,
) {
    class DefendServiceHost extends DefendOrmService<T> {
        constructor(
            @Inject(getRepositoryToken(entityClass)) protected readonly repo: Repository<T>,
        ) {
            super(repo, entityClass.name);
        }
    }

    return mixin(DefendServiceHost);
}
