"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const DummyCommandableAzureFunction_1 = require("./DummyCommandableAzureFunction");
suite('DummyCommandableAzureFunctionService', () => {
    let DUMMY1 = { id: null, key: "Key 1", content: "Content 1" };
    let DUMMY2 = { id: null, key: "Key 2", content: "Content 2" };
    let _functionService;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        let config = pip_services3_commons_nodex_1.ConfigParams.fromTuples('logger.descriptor', 'pip-services:logger:console:default:1.0', 'controller.descriptor', 'pip-services-dummies:controller:default:default:1.0', 'service.descriptor', 'pip-services-dummies:service:commandable-azurefunc:default:1.0');
        _functionService = new DummyCommandableAzureFunction_1.DummyCommandableAzureFunction();
        _functionService.configure(config);
        yield _functionService.open(null);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield _functionService.close(null);
    }));
    test('CRUD Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create one dummy
        let dummy1 = yield _functionService.act({
            cmd: 'dummies.create_dummy',
            dummy: DUMMY1
        });
        assert.isObject(dummy1);
        assert.equal(dummy1.content, DUMMY1.content);
        assert.equal(dummy1.key, DUMMY1.key);
        // Create another dummy
        let dummy2 = yield _functionService.act({
            cmd: 'dummies.create_dummy',
            dummy: DUMMY2
        });
        assert.isObject(dummy2);
        assert.equal(dummy2.content, DUMMY2.content);
        assert.equal(dummy2.key, DUMMY2.key);
        // Update the dummy
        dummy1.content = 'Updated Content 1';
        const updatedDummy1 = yield _functionService.act({
            cmd: 'dummies.update_dummy',
            dummy: dummy1
        });
        assert.isObject(updatedDummy1);
        assert.equal(updatedDummy1.id, dummy1.id);
        assert.equal(updatedDummy1.content, dummy1.content);
        assert.equal(updatedDummy1.key, dummy1.key);
        dummy1 = updatedDummy1;
        // Delete dummy
        yield _functionService.act({
            cmd: 'dummies.delete_dummy',
            dummy_id: dummy1.id
        });
        const dummy = yield _functionService.act({
            cmd: 'dummies.get_dummy_by_id',
            dummy_id: dummy1.id
        });
        assert.isNull(dummy || null);
        // Failed validation
        let err = yield _functionService.act({
            cmd: 'dummies.create_dummy',
            dummy: null
        });
        assert.equal(err.code, 'INVALID_DATA');
    }));
});
//# sourceMappingURL=DummyCommandableAzureFunctionService.test.js.map