"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.DummyCommandableAzureFunction = void 0;
const CommandableAzureFunction_1 = require("../../src/containers/CommandableAzureFunction");
const DummyFactory_1 = require("../DummyFactory");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
class DummyCommandableAzureFunction extends CommandableAzureFunction_1.CommandableAzureFunction {
    constructor() {
        super("dummy", "Dummy commandable Azure function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCommandableAzureFunction = DummyCommandableAzureFunction;
exports.handler = new DummyCommandableAzureFunction().getHandler();
//# sourceMappingURL=DummyCommandableAzureFunction.js.map