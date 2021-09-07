let process = require('process');

import { ConfigParams } from 'pip-services3-commons-nodex';
import { DummyClientFixture } from '../DummyClientFixture';
import { DummyAzureFunctionClient } from './DummyAzureFunctionClient';

suite('DummyAzureFunctionClient', ()=> {
    let appName = process.env['AZURE_FUNCTION_APP_NAME'];
    let functionName = process.env['AZURE_FUNCTION_NAME'];
    let protocol = process.env['AZURE_FUNCTION_PROTOCOL'];
    let authCode = process.env['AZURE_FUNCTION_AUTH_CODE'];
    let uri = process.env['AZURE_FUNCTION_URI'];

    if (!uri && (!appName || !functionName || !protocol || !authCode)) {
        return;
    }
    
    let config = ConfigParams.fromTuples(
        'connection.uri', uri,
        'connection.protocol', protocol,
        'connection.app_name', appName,
        'connection.function_name', functionName,
        'credential.auth_code', authCode,
    );

    let client: DummyAzureFunctionClient;
    let fixture: DummyClientFixture;

    setup(async () => {
        client = new DummyAzureFunctionClient();
        client.configure(config);

        fixture = new DummyClientFixture(client);

        await client.open(null);
    });

    teardown(async () => {
        await client.close(null);
    });

    test('Crud Operations', async () => {
        await fixture.testCrudOperations();
    });

});