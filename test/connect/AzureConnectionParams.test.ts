const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { AzureConnectionParams } from '../../src/connect/AzureConnectionParams';
import { AzureConnectionResolver } from '../../src/connect/AzureConnectionResolver';

suite('AzureConnectionParams', ()=> {

    test('Test Empty Connection', async () => {
        let connection = new AzureConnectionParams();
        assert.isNull(connection.getFunctionUri());
        assert.isNull(connection.getAppName());
        assert.isNull(connection.getFunctionName());
        assert.isNull(connection.getAuthCode());
        assert.isNull(connection.getProtocol());
    });

    test('Compose Config', async () => {
        const config1 = ConfigParams.fromTuples(
            'connection.uri', 'http://myapp.azurewebsites.net/api/myfunction',
            'credential.auth_code', '1234',
        );
        const config2 = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.app_name', 'myapp',
            'connection.function_name', 'myfunction',
            'credential.auth_code', '1234',
        );
        let resolver = new AzureConnectionResolver();
        resolver.configure(config1);
        let connection =  await resolver.resolve('');

        assert.equal('http://myapp.azurewebsites.net/api/myfunction', connection.getFunctionUri());
        assert.equal('myapp', connection.getAppName());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunctionName());
        assert.equal('1234', connection.getAuthCode());

        resolver = new AzureConnectionResolver();
        resolver.configure(config2);
        connection =  await resolver.resolve('');

        assert.equal('http://myapp.azurewebsites.net/api/myfunction', connection.getFunctionUri());
        assert.equal('http', connection.getProtocol());
        assert.equal('myapp', connection.getAppName());
        assert.equal('myfunction', connection.getFunctionName());
        assert.equal('1234', connection.getAuthCode());
    });
});