"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableAzureFunctionService = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const CommandableAzureFunctionService_1 = require("../../src/services/CommandableAzureFunctionService");
class DummyCommandableAzureFunctionService extends CommandableAzureFunctionService_1.CommandableAzureFunctionService {
    constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}
exports.DummyCommandableAzureFunctionService = DummyCommandableAzureFunctionService;
//# sourceMappingURL=DummyCommandableAzureFunctionService.js.map