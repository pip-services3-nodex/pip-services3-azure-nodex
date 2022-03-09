import { AzureFunction } from '../../src/containers/AzureFunction';
import { DummyFactory } from '../DummyFactory';

export class DummyAzureFunction extends AzureFunction {
    public constructor() {
        super("dummy", "Dummy Azure function");
        this._factories.add(new DummyFactory());
    }
}

export const handler = new DummyAzureFunction().getHandler();