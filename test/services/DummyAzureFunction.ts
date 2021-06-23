import { AzureFunction } from '../../src/containers/AzureFunction';
import { DummyFactory } from '../DummyFactory';

export class DummyAzureFunction extends AzureFunction {
    public constructor() {
        super("dummy", "Dummy lambda function");
        this._factories.add(new DummyFactory());
    }

    protected prepareContext(context:any): any {
        let params = {
            ...context,
        };
        if (context.hasOwnProperty('req')) {
            params = {
                ...params,
                ...context.req.body,
                ...context.req.query,
            }
        }
        return params;
    }
}

export const handler = new DummyAzureFunction().getHandler();