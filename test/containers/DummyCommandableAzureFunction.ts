import { Descriptor } from 'pip-services3-commons-nodex';

import { CommandableAzureFunction } from '../../src/containers/CommandableAzureFunction';
import { DummyFactory } from '../DummyFactory';

export class DummyCommandableAzureFunction extends CommandableAzureFunction {
    public constructor() {
        super("dummy", "Dummy Azure function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }
}