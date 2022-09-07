/** @module clients */
import { IOpenable } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';
import { CompositeTracer } from 'pip-services3-components-nodex';
import { CompositeCounters } from 'pip-services3-components-nodex';
import { InstrumentTiming } from "pip-services3-rpc-nodex";
import { AzureConnectionParams } from '../connect/AzureConnectionParams';
import { AzureConnectionResolver } from '../connect/AzureConnectionResolver';
/**
 * Abstract client that calls Azure Functions.
 *
 * When making calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 *
 * ### Configuration parameters ###
 *
 * - connections:
 *     - uri:                         (optional) full connection string or use protocol, app_name and function_name to build
 *     - protocol:                    (optional) connection protocol
 *     - app_name:                    (optional) Azure Function application name
 *     - function_name:               (optional) Azure Function name
 * - options:
 *      - retries:               number of retries (default: 3)
 *      - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *      - timeout:               invocation timeout in milliseconds (default: 10 sec)
 * - credentials:
 *     - auth_code:                   Azure Function auth code if use custom authorization provide empty string
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 *
 * @see [[AzureFunction]]
 * @see [[CommandableAzureClient]]
 *
 * ### Example ###
 *
 *     class MyAzureFunctionClient extends AzureFunctionClient implements IMyClient {
 *         ...
 *
 *         public async getData(correlationId: string, id: string): Promise<MyData> {
 *
 *             let timing = this.instrument(correlationId, 'myclient.get_data');
 *             const result = await this.call("get_data" correlationId, { id: id });
 *             timing.endTiming();
 *             return result;
 *         }
 *         ...
 *     }
 *
 *     let client = new MyAzureFunctionClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.uri", "http://myapp.azurewebsites.net/api/myfunction",
 *         "connection.protocol", "http",
 *         "connection.app_name", "myapp",
 *         "connection.function_name", "myfunction"
 *         "credential.auth_code", "XXXX"
 *     ));
 *
 *     const result = await client.getData("123", "1");
 */
export declare abstract class AzureFunctionClient implements IOpenable, IConfigurable, IReferenceable {
    /**
     * The HTTP client.
     */
    protected _client: any;
    /**
     * The Azure Function connection parameters
     */
    protected _connection: AzureConnectionParams;
    protected _retries: number;
    /**
     * The default headers to be added to every request.
     */
    protected _headers: any;
    /**
     * The connection timeout in milliseconds.
     */
    protected _connectTimeout: number;
    /**
     * The invocation timeout in milliseconds.
     */
    protected _timeout: number;
    /**
     * The remote service uri which is calculated on open.
     */
    protected _uri: string;
    /**
     * The dependencies resolver.
     */
    protected _dependencyResolver: DependencyResolver;
    /**
     * The connection resolver.
     */
    protected _connectionResolver: AzureConnectionResolver;
    /**
     * The logger.
     */
    protected _logger: CompositeLogger;
    /**
     * The performance counters.
     */
    protected _counters: CompositeCounters;
    /**
     * The tracer.
     */
    protected _tracer: CompositeTracer;
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
     * Adds instrumentation to log calls and measure call time.
     * It returns a CounterTiming object that is used to end the time measurement.
     *
     * @param correlationId         (optional) transaction id to trace execution through call chain.
     * @param name                  a method name.
     * @returns {InstrumentTiming}  object to end the time measurement.
     */
    protected instrument(correlationId: string, name: string): InstrumentTiming;
    /**
     * Checks if the component is opened.
     *
     * @returns {boolean} true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     *
     */
    open(correlationId: string): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    close(correlationId: string): Promise<void>;
    /**
     * Performs Azure Function invocation.
     *
     * @param cmd               an action name to be called.
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param args              action arguments
     * @return {any}            action result.
     */
    protected invoke<T>(cmd: string, correlationId: string, args: any): Promise<T>;
    /**
     * Calls a Azure Function action.
     *
     * @param cmd               an action name to be called.
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
    protected call<T>(cmd: string, correlationId: string, params?: any): Promise<T>;
}
