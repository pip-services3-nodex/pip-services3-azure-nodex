const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';

import { Dummy } from '../Dummy';
import { DummyAzureFunction } from './DummyAzureFunction';

suite('DummyAzureFunctionService', () => {
    let DUMMY1: Dummy = { id: null, key: "Key 1", content: "Content 1" };
    let DUMMY2: Dummy = { id: null, key: "Key 2", content: "Content 2" };

    let _functionService: DummyAzureFunction;

    suiteSetup(async () => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'controller.descriptor', 'pip-services-dummies:controller:default:default:1.0',
            'service.descriptor', 'pip-services-dummies:service:azure-function:default:1.0'
        );

        _functionService = new DummyAzureFunction();
        _functionService.configure(config);
        await _functionService.open(null);
    });

    suiteTeardown(async () => {
        await _functionService.close(null);
    });

    test('CRUD Operations', async () => {

        // Create one dummy
        let response = await _functionService.act({
            body: {
                cmd: 'dummies.create_dummy',
                dummy: DUMMY1
            }
        });
        let dummy1 = response.body;
        assert.isObject(dummy1);
        assert.equal(dummy1.content, DUMMY1.content);
        assert.equal(dummy1.key, DUMMY1.key);

        // Create another dummy
        response = await _functionService.act({
            body: {
                cmd: 'dummies.create_dummy',
                dummy: DUMMY2
            }
        });
        let dummy2 = response.body;
        assert.isObject(dummy2);
        assert.equal(dummy2.content, DUMMY2.content);
        assert.equal(dummy2.key, DUMMY2.key);

        // Update the dummy
        dummy1.content = 'Updated Content 1'
        response = await _functionService.act({
            body: {
                cmd: 'dummies.update_dummy',
                dummy: dummy1
            }
        });
        const updatedDummy1 = response.body;
        assert.isObject(updatedDummy1);
        assert.equal(updatedDummy1.id, dummy1.id);
        assert.equal(updatedDummy1.content, dummy1.content);
        assert.equal(updatedDummy1.key, dummy1.key);
        dummy1 = updatedDummy1

        // Delete dummy
        await _functionService.act({
            body: {
                cmd: 'dummies.delete_dummy',
                dummy_id: dummy1.id
            }
        });

        response = await _functionService.act({
            body: {
                cmd: 'dummies.get_dummy_by_id',
                dummy_id: dummy1.id
            }
        });
        const dummy = response.body;
        assert.isNull(dummy || null);
    });

});
