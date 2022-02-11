import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';

import { CommandableAzureFunctionClient } from '../../src/clients/CommandableAzureFunctionClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';

export class DummyCommandableAzureFunctionClient extends CommandableAzureFunctionClient implements IDummyClient {

    public constructor() { 
        super("dummies");
    }

    public async getDummies(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        return this.callCommand('get_dummies', correlationId, {
                filter: filter,
                paging: paging
        });
    }

    public async getDummyById(correlationId: string, dummyId: string): Promise<Dummy> {
        const response = await this.callCommand('get_dummy_by_id', correlationId, {
                dummy_id: dummyId
        });

        if (response == null || Object.keys(response).length === 0) {
            return null;
        }
        return response as Dummy;
    }

    public async createDummy(correlationId: string, dummy: any): Promise<Dummy> {
        return this.callCommand('create_dummy', correlationId, {
                dummy: dummy
        });
    }

    public async updateDummy(correlationId: string, dummy: any): Promise<Dummy> {
        return this.callCommand('update_dummy', correlationId, {
                dummy: dummy
        });
    }

    public async deleteDummy(correlationId: string, dummyId: string): Promise<Dummy> {
        return this.callCommand('delete_dummy', correlationId, {
                dummy_id: dummyId
        });
    }

}
