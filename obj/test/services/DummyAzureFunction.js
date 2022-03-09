"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.DummyAzureFunction = void 0;
const AzureFunction_1 = require("../../src/containers/AzureFunction");
const DummyFactory_1 = require("../DummyFactory");
class DummyAzureFunction extends AzureFunction_1.AzureFunction {
    constructor() {
        super("dummy", "Dummy Azure function");
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyAzureFunction = DummyAzureFunction;
exports.handler = new DummyAzureFunction().getHandler();
//# sourceMappingURL=DummyAzureFunction.js.map