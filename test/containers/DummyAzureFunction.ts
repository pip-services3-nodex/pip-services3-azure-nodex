import { DataPage } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams} from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';

import { AzureFunction } from '../../src/containers/AzureFunction';
import { IDummyController } from '../IDummyController';
import { DummyFactory } from '../DummyFactory';
import { DummySchema } from '../DummySchema';
import { Dummy } from "../Dummy";

export class DummyAzureFunction extends AzureFunction {
    private _controller: IDummyController;

    public constructor() {
        super("dummy", "Dummy Azure function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyController>('controller');
    }

    private async getPageByFilter(req: any): Promise<DataPage<Dummy>> {
        return this._controller.getPageByFilter(
            req.body.correlation_id,
            new FilterParams(req.body.filter),
            new PagingParams(req.body.paging)
        );
    }

    private async getOneById(req: any): Promise<Dummy> {
        return this._controller.getOneById(
            req.body.correlation_id,
            req.body.dummy_id
        );
    }

    private async create(req: any): Promise<Dummy> {
        return this._controller.create(
            req.body.correlation_id,
            req.body.dummy
        );
    }

    private async update(req: any): Promise<Dummy> {
        return this._controller.update(
            req.body.correlation_id,
            req.body.dummy,
        );
    }

    private async deleteById(req: any): Promise<Dummy> {
        return this._controller.deleteById(
            req.body.correlation_id,
            req.body.dummy_id,
        );
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