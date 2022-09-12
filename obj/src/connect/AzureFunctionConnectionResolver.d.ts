import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { ConnectionResolver } from 'pip-services3-components-nodex';
import { CredentialResolver } from 'pip-services3-components-nodex';
import { AzureFunctionConnectionParams } from './AzureFunctionConnectionParams';
/**
 * Helper class to retrieve Azure connection and credential parameters,
 * validate them and compose a [[AzureConnectionParams]] value.
 *
 * ### Configuration parameters ###
 *
 * - connections:
 *      - uri:           full connection uri with specific app and function name
 *      - protocol:      connection protocol
 *      - app_name:      alternative app name
 *      - function_name: application function name
 * - credentials:
 *      - auth_code:     authorization code or null if using custom auth
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 *
 * @see [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/classes/connect.connectionparams.html ConnectionParams]] (in the Pip.Services components package)
 * @see [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Services components package)
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "connection.uri", "http://myapp.azurewebsites.net/api/myfunction",
 *         "connection.app_name", "myapp",
 *         "connection.function_name", "myfunction",
 *         "credential.auth_code", "XXXXXXXXXX",
 *     );
 *
 *     let connectionResolver = new AzureConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *
 *     const connectionParams = await connectionResolver.resolve("123");
 */
export declare class AzureFunctionConnectionResolver implements IConfigurable, IReferenceable {
    /**
     * The connection resolver.
     */
    protected _connectionResolver: ConnectionResolver;
    /**
     * The credential resolver.
     */
    protected _credentialResolver: CredentialResolver;
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Resolves connection and credential parameters and generates a single
     * AzureConnectionParams value.
     *
     * @param correlationId             (optional) transaction id to trace execution through call chain.
     *
     * @return {AzureFunctionConnectionParams} 	AzureConnectionParams value or error.
     *
     * @see [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Services components package)
     */
    resolve(correlationId: string): Promise<AzureFunctionConnectionParams>;
    private composeConnection;
}
