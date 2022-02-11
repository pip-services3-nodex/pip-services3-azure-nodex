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
        const response = await this.call<DummyAzureFunctionClientResponse>('get_dummies', correlationId, {
            filter: filter,
            paging: paging
        });

        return response as DataPage<Dummy>;
    }

    public async getDummyById(correlationId: string, dummyId: string): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('get_dummy_by_id', correlationId, {
                dummy_id: dummyId
        });

        if (response == null || Object.keys(response).length === 0) {
            return null;
        }

        return response as Dummy;
    }

    public async createDummy(correlationId: string, dummy: any): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('create_dummy', correlationId, {
                dummy: dummy
        });

        return response as Dummy;
    }

    public async updateDummy(correlationId: string, dummy: any): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('update_dummy', correlationId, {
                dummy: dummy
        });

        return response as Dummy;
    }

    public async deleteDummy(correlationId: string, dummyId: string): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('delete_dummy', correlationId, {
                dummy_id: dummyId
        });

        return response as Dummy;
    }

}
