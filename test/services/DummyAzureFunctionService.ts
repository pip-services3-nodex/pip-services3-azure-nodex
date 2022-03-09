import { Descriptor } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams} from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';

import { AzureFunctionService } from '../../src/services/AzureFunctionService';
import { IDummyController } from '../IDummyController';
import { DummySchema } from '../DummySchema';

export class DummyAzureFunctionService extends AzureFunctionService {
    private _controller: IDummyController;
    private _headers = {
        'Content-Type': 'application/json'
    };

    public constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }

    protected getBodyData(context:any): any {
        let params = {
            ...context,
        };
        if (context.hasOwnProperty('body')) {
            params = {
                ...params,
                ...context.body,
            }
        }
        return params;
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyController>('controller');
    }

    private async getPageByFilter(req: any): Promise<any> {
        const page = await this._controller.getPageByFilter(
            req.body.correlation_id,
            new FilterParams(req.body.filter),
            new PagingParams(req.body.paging)
        );
        return { body: page, headers: this._headers };
    }

    private async getOneById(req: any): Promise<any> {
        let params = this.getBodyData(req);
        const dummy = await this._controller.getOneById(
            params.correlation_id,
            params.dummy_id
        );
        return { body: dummy, headers: this._headers };
    }

    private async create(req: any): Promise<any> {
        let params = this.getBodyData(req);
        const dummy = await this._controller.create(
            params.correlation_id,
            params.dummy
        );
        return { body: dummy, headers: this._headers };
    }

    private async update(req: any): Promise<any> {
        let params = this.getBodyData(req);
        const dummy = await this._controller.update(
            params.correlation_id,
            params.dummy,
        );
        return { body: dummy, headers: this._headers };
    }

    private async deleteById(req: any): Promise<any> {
        let params = this.getBodyData(req);
        const dummy = await this._controller.deleteById(
            params.correlation_id,
            params.dummy_id,
        );
        return { body: dummy, headers: this._headers };
    }

    protected register() {
        this.registerAction(
            'get_dummies',
            new ObjectSchema(true).withOptionalProperty('body', 
                new ObjectSchema()
                    .withOptionalProperty("filter", new FilterParamsSchema())
                    .withOptionalProperty("paging", new PagingParamsSchema())),
            this.getPageByFilter);

        this.registerAction(
            'get_dummy_by_id',
            new ObjectSchema(true).withOptionalProperty('body', 
                new ObjectSchema(true)
                    .withOptionalProperty("dummy_id", TypeCode.String)
            ),
            this.getOneById);

        this.registerAction(
            'create_dummy',
            new ObjectSchema(true).withOptionalProperty('body', 
                new ObjectSchema(true)
                    .withRequiredProperty("dummy", new DummySchema())
            ),
            this.create);

        this.registerAction(
            'update_dummy',
            new ObjectSchema(true).withOptionalProperty('body',
                new ObjectSchema(true)
                    .withRequiredProperty("dummy", new DummySchema())
            ),
            this.update);

        this.registerAction(
            'delete_dummy',
            new ObjectSchema(true).withOptionalProperty('body',
                new ObjectSchema(true)
                    .withOptionalProperty("dummy_id", TypeCode.String)
            ), this.deleteById);
    }
}
