import { Controller, Inject, mixin, ValidationPipeOptions } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, ParamsOptions, QueryOptions } from '@nestjsx/crud';

import { toKebab } from './defend.util';


export function DefendController<T extends new (...args: any[]) => any>(
    entityClass: T,
    service: any,
    query?: QueryOptions,
    params?: ParamsOptions,
    validation?: ValidationPipeOptions,
) {
    @Crud({
        model: {
            type: entityClass,
        },
        params,
        query,
        validation,
    })
    @ApiTags(entityClass.name)
    @Controller(`api/v1/${toKebab(entityClass.name)}`)
    @ApiBearerAuth()
    class DefendControllerHost {
        @Inject(service) service;
    }

    return mixin(DefendControllerHost);
}
