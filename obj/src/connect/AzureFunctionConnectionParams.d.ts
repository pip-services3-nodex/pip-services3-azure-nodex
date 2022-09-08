/** @module connect */
import { ConfigParams } from 'pip-services3-commons-nodex';
/**
 * Contains connection parameters to authenticate against Azure Functions
 * and connect to specific Azure Function.
 *
 * The class is able to compose and parse Azure Function connection parameters.
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
 * In addition to standard parameters [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/classes/auth.credentialparams.html CredentialParams]] may contain any number of custom parameters
 *
 * @see [[AzureConnectionResolver]]
 *
 * ### Example ###
 *
 *     let connection = AzureConnectionParams.fromTuples(
 *         "connection.uri", "http://myapp.azurewebsites.net/api/myfunction",
 *         "connection.protocol", "http",
 *         "connection.app_name", "myapp",
 *         "connection.function_name", "myfunction",
 *         "connection.auth_code", "code",
 *     );
 *
 *     const uri = connection.getFunctionUri();             // Result: "http://myapp.azurewebsites.net/api/myfunction"
 *     const protocol = connection.getAppName();            // Result: "http"
 *     const appName = connection.getAppName();             // Result: "myapp"
 *     const functionName = connection.getFunctionName();   // Result: "myfunction"
 *     const authCode = connection.getAuthCode();           // Result: "code"
 */
export declare class AzureFunctionConnectionParams extends ConfigParams {
    /**
     * Creates an new instance of the connection parameters.
     *
     * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    constructor(values?: any);
    /**
     * Gets the Azure function connection protocol.
     *
     * @returns {string} the Azure function connection protocol.
     */
    getProtocol(): string;
    /**
     * Sets the Azure function connection protocol.
     *
     * @param value a new Azure function connection protocol.
     */
    setProtocol(value: string): void;
    /**
     * Gets the Azure function uri.
     *
     * @returns {string} the Azure function uri.
     */
    getFunctionUri(): string;
    /**
     * Sets the Azure function uri.
     *
     * @param value a new Azure function uri.
     */
    setFunctionUri(value: string): void;
    /**
     * Gets the Azure app name.
     *
     * @returns {string} the Azure app name.
     */
    getAppName(): string;
    /**
     * Sets the Azure app name.
     *
     * @param value a new Azure app name.
     */
    setAppName(value: string): void;
    /**
     * Gets the Azure function name.
     *
     * @returns {string} the Azure function name.
     */
    getFunctionName(): string;
    /**
     * Sets the Azure function name.
     *
     * @param value a new Azure function name.
     */
    setFunctionName(value: string): void;
    /**
     * Gets the Azure auth code.
     *
     * @returns {string} the Azure auth code.
     */
    getAuthCode(): string;
    /**
     * Sets the Azure auth code.
     *
     * @param value a new Azure auth code.
     */
    setAuthCode(value: string): void;
    /**
     * Creates a new AzureConnectionParams object filled with key-value pairs serialized as a string.
     *
     * @param line 		                a string with serialized key-value pairs as "key1=value1;key2=value2;..."
     * 					                Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
     * @returns {AzureFunctionConnectionParams}	a new AzureConnectionParams object.
     */
    static fromString(line: string): AzureFunctionConnectionParams;
    /**
     * Validates this connection parameters
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    validate(correlationId: string): void;
    /**
     * Retrieves AzureConnectionParams from configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
     *
     * @param config 	                configuration parameters
     * @returns {AzureFunctionConnectionParams}	the generated AzureConnectionParams object.
     *
     * @see [[mergeConfigs]]
     */
    static fromConfig(config: ConfigParams): AzureFunctionConnectionParams;
    /**
     * Retrieves AzureConnectionParams from multiple configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
     *
     * @param configs 	                a list with configuration parameters
     * @returns {AzureFunctionConnectionParams}	the generated AzureConnectionParams object.
     *
     * @see [[fromConfig]]
     */
    static mergeConfigs(...configs: ConfigParams[]): AzureFunctionConnectionParams;
    /**
     * Creates a new ConfigParams object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples	the tuples to fill a new ConfigParams object.
     * @returns			a new ConfigParams object.
     *
     * @see [[ConfigParams.fromTuples]]
     */
    static fromTuples(...tuples: any[]): AzureFunctionConnectionParams;
}
