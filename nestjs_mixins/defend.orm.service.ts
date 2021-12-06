import { CrudRequest, CrudRequestOptions, GetManyDefaultResponse } from '@nestjsx/crud';
import { ParsedRequestParams } from '@nestjsx/crud-request';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

export class DefendOrmService<T> extends TypeOrmCrudService<T> {

    constructor(repo, private classNAme: string) { super(repo) }


    async getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
        const options = req.options;
        const parsed = req.parsed as ParsedRequestParams;

        // Removing defined relations
        const _joins = options.query.join;
        const _newOptions = JSON.parse(JSON.stringify(options));
        let response: GetManyDefaultResponse<T> | T[];

        if (_joins && Object.keys(_joins).length > 0) {
            // One query per relation (fixing LEFT JOIN problem)
            for (const _join of Object.keys(_joins)) {
                const shardOption = Object.assign({}, _newOptions)
                shardOption.query.join = {}
                if (this.isInnerJoin(_join)) continue;

                for (const _j of this.getWithInnerjoins(_join, Object.keys(_joins)))
                    shardOption.query.join[_j] = _joins[_j]

                const builder = await this.createBuilder(parsed, shardOption);
                const query = await this.doGetMany(builder, parsed, shardOption);
                response = this.mapManyQueryToResponse(response, query, _join, parsed, shardOption)

            }
        } else {
            const builder = await this.createBuilder(parsed, options);
            const query = await this.doGetMany(builder, parsed, options);
            response = this.mapManyQueryToResponse(response, query, null, parsed, options)
        }

        const _joinCount = _joins ? Object.keys(_joins) : []

        console.log(`### [${this.classNAme}] USING DEFEND ORM getMany with [${_joinCount.join(" | ")}] Joins ######`)

        return response;
    }

    /**
     * Get one
     * @param req
     */
    public async getOne(req: CrudRequest): Promise<T> {
        return this.getOneOrFail(req);
    }

    protected async getOneOrFail(req: CrudRequest, shallow = false): Promise<T> {
        const options = req.options;
        const parsed = req.parsed as ParsedRequestParams;

        // Removing defined relations
        const _joins = options.query.join;
        const _newOptions = JSON.parse(JSON.stringify(options));
        let response: T


        if (_joins && Object.keys(_joins).length > 0)
            // One Query per relation (fixing LEFT JOIN problem)
            for (const _join of Object.keys(_joins)) {

                const shardOption = Object.assign({}, _newOptions)
                shardOption.query.join = {}
                if (this.isInnerJoin(_join)) continue;

                for (const _j of this.getWithInnerjoins(_join, Object.keys(_joins)))
                    shardOption.query.join[_j] = _joins[_j]

                const builder = shallow
                    ? this.repo.createQueryBuilder(this.alias)
                    : await this.createBuilder(parsed, shardOption);

                if (shallow) {
                    this.setSearchCondition(builder, parsed.search);
                }

                const query = await builder.getOne();
                response = this.mapOneQueryToResponse(response, query, _join)

                if (!response) {
                    this.throwNotFoundException(this.alias);
                }

            }

        const _joinCount = _joins ? Object.keys(_joins) : []
        console.log(`### [${this.classNAme}] USING DEFEND ORM getOneOrFail with [${_joinCount.join(" | ")}] Joins ######`)

        return response;
    }

    private mapManyQueryToResponse(
        response: GetManyDefaultResponse<T> | T[],
        query: GetManyDefaultResponse<T> | T[],
        key: string,
        parsed: ParsedRequestParams,
        options: CrudRequestOptions
    ): GetManyDefaultResponse<T> | T[] {

        if (!response) {
            return query;
        }

        if (parsed.page || options.query.alwaysPaginate) {
            const _response = response as GetManyDefaultResponse<T>
            const _query = query as GetManyDefaultResponse<T>


            _response.data = _response.data.map((d, i) => { d[key] = _query.data[i][key]; return d; })
            return _response;
        }
        const _response = response as T[]
        const _query = query as T[]

        _response.forEach((r, i) => r[key] = _query[i][key])

        return _response;
    }


    private mapOneQueryToResponse(
        response: T,
        query: T,
        key: string
    ): T {

        if (!response) return query

        const _response = response as T
        const _query = query as T

        _response[key] = _query[key]

        return _response
    }

    private getWithInnerjoins(key: string, joins: string[]) {
        return [key, ...joins.filter(j => j.includes(`${key}.`))]
    }

    private isInnerJoin(key: string) {
        return key.includes('.')
    }
}

