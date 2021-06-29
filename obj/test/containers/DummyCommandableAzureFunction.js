"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableAzureFunction = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const CommandableAzureFunction_1 = require("../../src/containers/CommandableAzureFunction");
const DummyFactory_1 = require("../DummyFactory");
class DummyCommandableAzureFunction extends CommandableAzureFunction_1.CommandableAzureFunction {
    constructor() {
        super("dummy", "Dummy lambda function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCommandableAzureFunction = DummyCommandableAzureFunction;
//# sourceMappingURL=DummyCommandableAzureFunction.js.map