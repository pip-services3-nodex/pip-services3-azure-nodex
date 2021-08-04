const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { AzureConnectionParams } from '../../src/connect/AzureConnectionParams';

suite('AzureConnectionParams', ()=> {

    test('Test Empty Connection', async () => {
        let connection = new AzureConnectionParams();
        assert.isNull(connection.getFunctionUri());
        assert.isNull(connection.getAppName());
        assert.isNull(connection.getFunctionName());
        assert.isNull(connection.getAuthCode());
    });

    test('Compose Config', async () => {
        let connection = AzureConnectionParams.fromConfig(
            ConfigParams.fromTuples(
                'connection.uri', 'http://myapp.azurewebsites.net/api/myfunction',
                'connection.app_name', 'myapp',
                'connection.function_name', 'myfunction',
                'credential.auth_code', '1234',
            )
        );

        assert.equal('http://myapp.azurewebsites.net/api/myfunction', connection.getFunctionUri());
        assert.equal('myapp', connection.getAppName());
        assert.equal('myfunction', connection.getFunctionName());
        assert.equal('1234', connection.getAuthCode());
    });
});