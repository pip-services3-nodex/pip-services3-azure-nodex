import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';

import { AzureFunctionClient } from '../../src/clients/AzureFunctionClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';

export interface DummyAzureFunctionClientResponse {
    body?: any
}

export class DummyAzureFunctionClient extends AzureFunctionClient implements IDummyClient {

    public constructor() { 
        super();
    }

    public async getDummies(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        const response = await this.call<DummyAzureFunctionClientResponse>('dummy.get_dummies', correlationId, {
            filter: filter,
            paging: paging
        });

        return response.body as DataPage<Dummy>;
    }

    public async getDummyById(correlationId: string, dummyId: string): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('dummy.get_dummy_by_id', correlationId, {
                dummy_id: dummyId
        });

        return response.body as Dummy;
    }

    public async createDummy(correlationId: string, dummy: any): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('dummy.create_dummy', correlationId, {
                dummy: dummy
        });

        return response.body as Dummy;
    }

    public async updateDummy(correlationId: string, dummy: any): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('dummy.update_dummy', correlationId, {
                dummy: dummy
        });

        return response.body as Dummy;
    }

    public async deleteDummy(correlationId: string, dummyId: string): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('dummy.delete_dummy', correlationId, {
                dummy_id: dummyId
        });

        return response.body as Dummy;
    }

}
